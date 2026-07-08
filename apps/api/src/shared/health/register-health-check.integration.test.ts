import { Hono } from "hono"
import { describe, expect, it } from "vitest"
import type { AppEnv } from "../app-env"
import { runInRollback } from "../db/test-support/test-db"
import { createLoggerStub } from "../logger/test-support/logger-stub"
import { registerHealthCheck } from "./register-health-check"

describe("registerHealthCheck", () => {
  it("実際の DB に接続できる場合は /health/ready が 200 を返す", () =>
    runInRollback(async (tx) => {
      const app = new Hono<AppEnv>()
      registerHealthCheck(app, tx, createLoggerStub())
      const res = await app.request("/health/ready")
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ status: "ok" })
    }))
})
