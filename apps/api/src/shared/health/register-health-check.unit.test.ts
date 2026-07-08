import { Hono } from "hono"
import { describe, expect, it, vi } from "vitest"
import type { AppEnv } from "../app-env"
import { createLoggerStub } from "../logger/test-support/logger-stub"
import { registerHealthCheck } from "./register-health-check"

describe("registerHealthCheck", () => {
  it("/health は DB に触らず 200 を返す", async () => {
    const execute = vi.fn()
    const app = new Hono<AppEnv>()
    registerHealthCheck(app, { execute }, createLoggerStub())
    const res = await app.request("/health")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: "ok" })
    expect(execute).not.toHaveBeenCalled()
  })

  it("DB に接続できる場合は /health/ready が 200 を返しログを出力しない", async () => {
    const execute = vi.fn().mockResolvedValue([])
    const logger = createLoggerStub()
    const app = new Hono<AppEnv>()
    registerHealthCheck(app, { execute }, logger)
    const res = await app.request("/health/ready")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: "ok" })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("DB に接続できない場合は /health/ready が 503 を返す", async () => {
    const execute = vi.fn().mockRejectedValue(new Error("connection refused"))
    const app = new Hono<AppEnv>()
    registerHealthCheck(app, { execute }, createLoggerStub())
    const res = await app.request("/health/ready")
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ status: "error" })
  })

  it("DB に接続できない場合はエラーログを出力する", async () => {
    const error = new Error("connection refused")
    const execute = vi.fn().mockRejectedValue(error)
    const logger = createLoggerStub()
    const app = new Hono<AppEnv>()
    registerHealthCheck(app, { execute }, logger)
    await app.request("/health/ready")
    expect(logger.error).toHaveBeenCalledExactlyOnceWith(
      { err: error },
      "readiness check failed",
    )
  })
})
