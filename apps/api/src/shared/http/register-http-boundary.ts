import type { Hono } from "hono"
import { bodyLimit } from "hono/body-limit"
import { HTTPException } from "hono/http-exception"
import { secureHeaders } from "hono/secure-headers"
import { timeout } from "hono/timeout"
import type { AppEnv } from "../app-env"
import { httpMessages } from "../error/http-messages"

export type HttpBoundaryConfig = {
  readonly bodyLimitBytes: number
  readonly requestTimeoutMs: number
}

export const registerHttpBoundary = (
  app: Hono<AppEnv>,
  config: HttpBoundaryConfig,
) => {
  app.use(secureHeaders())
  app.use(
    bodyLimit({
      maxSize: config.bodyLimitBytes,
      onError: (c) =>
        c.json({ errors: [{ message: httpMessages.payloadTooLarge }] }, 413),
    }),
  )
  app.use(
    timeout(
      config.requestTimeoutMs,
      () => new HTTPException(504, { message: httpMessages.gatewayTimeout }),
    ),
  )
}
