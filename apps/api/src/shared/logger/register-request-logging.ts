import type { Hono } from "hono"
import { requestId } from "hono/request-id"
import type { AppEnv } from "../app-env"
import type { AppLogger } from "./logger"

export const registerRequestLogging = (
  app: Hono<AppEnv>,
  baseLogger: AppLogger,
) => {
  app.use(requestId())

  app.use(async (c, next) => {
    const logger = baseLogger.child({ requestId: c.get("requestId") })
    c.set("logger", logger)

    const startedAt = performance.now()
    await next()
    const durationMs = Math.round(performance.now() - startedAt)

    logger.info(
      {
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        durationMs,
      },
      "request completed",
    )
  })
}
