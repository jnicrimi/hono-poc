import { Hono } from "hono"
import { describe, expect, it } from "vitest"
import type { AppEnv } from "../app-env"
import { registerCors } from "./register-cors"

const ALLOWED_ORIGIN = "http://localhost:5173"

describe("registerCors", () => {
  it("許可されたオリジンの場合は access-control-allow-origin と credentials を返す", async () => {
    const app = new Hono<AppEnv>()
    registerCors(app, { allowedOrigins: [ALLOWED_ORIGIN] })
    app.get("/ping", (c) => c.json({ ok: true }, 200))
    const res = await app.request("/ping", {
      headers: { origin: ALLOWED_ORIGIN },
    })
    expect(res.status).toBe(200)
    expect(res.headers.get("access-control-allow-origin")).toBe(ALLOWED_ORIGIN)
    expect(res.headers.get("access-control-allow-credentials")).toBe("true")
  })

  it("許可されていないオリジンの場合は access-control-allow-origin を付けない", async () => {
    const app = new Hono<AppEnv>()
    registerCors(app, { allowedOrigins: [ALLOWED_ORIGIN] })
    app.get("/ping", (c) => c.json({ ok: true }, 200))
    const res = await app.request("/ping", {
      headers: { origin: "http://unauthorized.example.com" },
    })
    expect(res.status).toBe(200)
    expect(res.headers.get("access-control-allow-origin")).toBeNull()
  })

  it("preflight リクエストの場合は 204 と許可ヘッダを返す", async () => {
    const app = new Hono<AppEnv>()
    registerCors(app, { allowedOrigins: [ALLOWED_ORIGIN] })
    const res = await app.request("/ping", {
      method: "OPTIONS",
      headers: {
        origin: ALLOWED_ORIGIN,
        "access-control-request-method": "POST",
      },
    })
    expect(res.status).toBe(204)
    expect(res.headers.get("access-control-allow-origin")).toBe(ALLOWED_ORIGIN)
    expect(res.headers.get("access-control-allow-methods")).toContain("POST")
    expect(res.headers.get("access-control-allow-credentials")).toBe("true")
  })
})
