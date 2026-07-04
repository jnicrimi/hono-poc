import { serve } from "@hono/node-server"
import { loadEnv } from "./shared/config/env"
import { createDb } from "./shared/db/client"
import { registerErrorHandlers } from "./shared/error/error-handlers"
import { registerGracefulShutdown } from "./shared/lifecycle/register-graceful-shutdown"
import { createLogger } from "./shared/logger/logger"
import { registerRequestLogging } from "./shared/logger/request-logging"
import { createOpenApiApp } from "./shared/openapi/create-openapi-app"
import { registerOpenApiDocs } from "./shared/openapi/register-openapi-docs"

const env = loadEnv()
const logger = createLogger(env)
const db = createDb(env.DATABASE_URL, {
  max: env.DB_POOL_MAX,
  idleTimeoutSec: env.DB_POOL_IDLE_TIMEOUT_SEC,
  connectTimeoutSec: env.DB_POOL_CONNECT_TIMEOUT_SEC,
  maxLifetimeSec: env.DB_POOL_MAX_LIFETIME_SEC,
})
const app = createOpenApiApp()

app.get("/health", (c) => c.json({ status: "ok" }, 200))

registerRequestLogging(app, logger)
registerErrorHandlers(app, logger)
registerOpenApiDocs(app, { enabled: env.NODE_ENV !== "production" })

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info({ port: info.port }, "server started")
})

registerGracefulShutdown({
  server,
  db,
  logger,
  timeoutMs: env.SHUTDOWN_TIMEOUT_MS,
})
