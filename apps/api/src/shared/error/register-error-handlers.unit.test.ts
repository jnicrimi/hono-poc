import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { describe, expect, it } from "vitest"
import type { AppEnv } from "../app-env"
import { createLoggerStub } from "../logger/test-support/logger-stub"
import { AppError, type ErrorCategory } from "./app-error"
import { registerErrorHandlers } from "./register-error-handlers"

class StubError extends AppError {
  constructor(
    readonly category: ErrorCategory,
    message: string,
  ) {
    super(message)
  }
}

const buildApp = (handler: () => never, logger = createLoggerStub()) => {
  const app = new Hono<AppEnv>()
  registerErrorHandlers(app, logger)
  app.get("/dummy", handler)
  return app
}

describe("registerErrorHandlers", () => {
  it("AppError はカテゴリと一致したステータスを返しログは出力しない", async () => {
    const cases = [
      ["BAD_REQUEST", 400],
      ["CONFLICT", 409],
      ["NOT_FOUND", 404],
      ["VALIDATION", 422],
    ] as const
    const logger = createLoggerStub()

    for (const [category, status] of cases) {
      const app = buildApp(() => {
        throw new StubError(category, "dummy message")
      }, logger)

      const res = await app.request("/dummy")

      expect(res.status).toBe(status)
      expect(await res.json()).toEqual({
        errors: [{ message: "dummy message" }],
      })
      expect(logger.error).not.toHaveBeenCalled()
    }
  })

  it("HTTPException(400) はメッセージを日本語の定型文に置き換える", async () => {
    const logger = createLoggerStub()
    const app = buildApp(() => {
      throw new HTTPException(400, {
        message: "Malformed JSON in request body",
      })
    }, logger)

    const res = await app.request("/dummy")

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      errors: [{ message: "リクエストの内容が正しくありません" }],
    })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("HTTPException はログを出力しない", async () => {
    const logger = createLoggerStub()
    const app = buildApp(() => {
      throw new HTTPException(504, { message: "タイムアウトしました" })
    }, logger)

    const res = await app.request("/dummy")

    expect(res.status).toBe(504)
    expect(await res.json()).toEqual({
      errors: [{ message: "タイムアウトしました" }],
    })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("AppError 以外の例外はログを出力する", async () => {
    const logger = createLoggerStub()
    const app = buildApp(() => {
      throw new Error("internal detail")
    }, logger)

    const res = await app.request("/dummy")

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      errors: [{ message: "サーバーエラーが発生しました" }],
    })
    expect(logger.error).toHaveBeenCalledTimes(1)
  })

  it("リソースが存在しない場合はログを出力しない", async () => {
    const app = new Hono<AppEnv>()
    registerErrorHandlers(app, createLoggerStub())

    const res = await app.request("/missing")

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({
      errors: [{ message: "リクエストされたリソースが見つかりません" }],
    })
  })
})
