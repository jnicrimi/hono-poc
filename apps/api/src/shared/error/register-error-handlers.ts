import type { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import type { ContentfulStatusCode } from "hono/utils/http-status"
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
      // Hono の validator は JSON パース失敗時に英語メッセージの HTTPException(400) を投げるため定型文へ置き換える
      const message =
        err.status === 400 ? httpMessages.invalidRequest : err.message
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
