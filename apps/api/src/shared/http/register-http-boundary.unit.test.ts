import { Hono } from "hono"
import { describe, expect, it } from "vitest"
import type { AppEnv } from "../app-env"
import { registerErrorHandlers } from "../error/register-error-handlers"
import { createLoggerStub } from "../logger/test-support/logger-stub"
import { registerHttpBoundary } from "./register-http-boundary"
import { createHttpBoundaryConfigStub } from "./test-support/http-boundary-config-stub"

describe("registerHttpBoundary", () => {
  it("制限を超える body の場合は 413 とエラーレスポンスを返す", async () => {
    const app = new Hono<AppEnv>()
    registerErrorHandlers(app, createLoggerStub())
    registerHttpBoundary(
      app,
      createHttpBoundaryConfigStub({ bodyLimitBytes: 16 }),
    )
    app.post("/echo", (c) => c.json({ ok: true }, 200))
    const res = await app.request("/echo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: "0123456789abcdef0123456789abcdef" }),
    })
    expect(res.status).toBe(413)
    expect(await res.json()).toEqual({
      errors: [{ message: "リクエストのサイズが大きすぎます" }],
    })
  })

  it("処理が timeout を超えた場合は 504 とエラーレスポンスを返す", async () => {
    const app = new Hono<AppEnv>()
    registerErrorHandlers(app, createLoggerStub())
    registerHttpBoundary(
      app,
      createHttpBoundaryConfigStub({ requestTimeoutMs: 10 }),
    )
    app.get("/slow", async (c) => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      return c.json({ ok: true }, 200)
    })
    const res = await app.request("/slow")
    expect(res.status).toBe(504)
    expect(await res.json()).toEqual({
      errors: [{ message: "リクエストがタイムアウトしました" }],
    })
  })

  it("セキュリティヘッダを付与する", async () => {
    const app = new Hono<AppEnv>()
    registerErrorHandlers(app, createLoggerStub())
    registerHttpBoundary(app, createHttpBoundaryConfigStub())
    app.get("/ping", (c) => c.json({ ok: true }, 200))
    const res = await app.request("/ping")
    expect(res.headers.get("x-content-type-options")).toBe("nosniff")
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN")
  })
})
