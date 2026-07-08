import { Hono } from "hono"
import { describe, expect, it } from "vitest"
import type { AppEnv } from "../app-env"
import type { AppLogger } from "./logger"
import { registerRequestLogging } from "./register-request-logging"
import { createLoggerStub } from "./test-support/logger-stub"

const buildApp = (logger: AppLogger) => {
  const app = new Hono<AppEnv>()
  registerRequestLogging(app, logger)
  app.get("/ping", (c) => c.text("pong"))
  return app
}

describe("registerRequestLogging", () => {
  it("requestId 付きの child logger を生成する", async () => {
    const logger = createLoggerStub()
    const app = buildApp(logger)
    await app.request("/ping")
    expect(logger.child).toHaveBeenCalledWith({
      requestId: expect.any(String),
    })
  })

  it("child logger を context に設定する", async () => {
    const logger = createLoggerStub()
    const app = new Hono<AppEnv>()
    registerRequestLogging(app, logger)
    let contextLogger: AppLogger | undefined
    app.get("/ping", (c) => {
      contextLogger = c.get("logger")
      return c.text("pong")
    })
    await app.request("/ping")
    expect(contextLogger).toBe(logger.child({ requestId: "" }))
  })

  it("リクエスト完了時に構造化ログを出力する", async () => {
    const logger = createLoggerStub()
    const app = buildApp(logger)
    await app.request("/ping")
    expect(logger.info).toHaveBeenCalledWith(
      {
        method: "GET",
        path: "/ping",
        status: 200,
        durationMs: expect.any(Number),
      },
      "request completed",
    )
  })
})
