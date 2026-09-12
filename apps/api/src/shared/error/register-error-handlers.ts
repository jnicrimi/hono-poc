import type { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status"
import type { AppEnv } from "../app-env"
import type { AppLogger } from "../logger/logger"
import { AppError, type ErrorCategory } from "./app-error"
import { httpMessages } from "./http-messages"

const STATUS: Record<ErrorCategory, ContentfulStatusCode> = {
  BAD_REQUEST: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
  VALIDATION: 422,
}

const VALIDATOR_MESSAGES: Partial<Record<StatusCode, string>> = {
  400: httpMessages.invalidRequest,
  415: httpMessages.unsupportedMediaType,
}

export const registerErrorHandlers = (
  app: Hono<AppEnv>,
  baseLogger: AppLogger,
) => {
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json(
        { errors: [{ message: err.message }] },
        STATUS[err.category],
      )
    }
    if (err instanceof HTTPException) {
      // validator が投げる HTTPException は英語メッセージのため定型文へ置き換える
      // 400: JSON パース失敗 / 415: 宣言済み media type と一致しない Content-Type
      const message = VALIDATOR_MESSAGES[err.status] ?? err.message
      return c.json({ errors: [{ message }] }, err.status)
    }
    const logger = c.get("logger") ?? baseLogger
    logger.error(
      { err, method: c.req.method, path: c.req.path },
      "unhandled error",
    )
    return c.json(
      { errors: [{ message: httpMessages.internalServerError }] },
      500,
    )
  })

  app.notFound((c) =>
    c.json({ errors: [{ message: httpMessages.routeNotFound }] }, 404),
  )
}
