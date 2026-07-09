import { serve } from "@hono/node-server"
import { loadEnv } from "./shared/config/env"
import { createDb } from "./shared/db/client"
import { createApp } from "./shared/di/container"
import { registerGracefulShutdown } from "./shared/lifecycle/register-graceful-shutdown"
import { createLogger } from "./shared/logger/logger"

const env = loadEnv()
const logger = createLogger(env)
const db = createDb(env.DATABASE_URL, {
  max: env.DB_POOL_MAX,
  idleTimeoutSec: env.DB_POOL_IDLE_TIMEOUT_SEC,
  connectTimeoutSec: env.DB_POOL_CONNECT_TIMEOUT_SEC,
  maxLifetimeSec: env.DB_POOL_MAX_LIFETIME_SEC,
})
const app = createApp(db, logger, {
  enableApiDocs: env.NODE_ENV !== "production",
  cors: { allowedOrigins: env.CORS_ALLOWED_ORIGINS },
  httpBoundary: {
    bodyLimitBytes: env.BODY_LIMIT_BYTES,
    requestTimeoutMs: env.REQUEST_TIMEOUT_MS,
  },
})

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info({ port: info.port }, "server started")
})

registerGracefulShutdown({
  server,
  db,
  logger,
  timeoutMs: env.SHUTDOWN_TIMEOUT_MS,
})
