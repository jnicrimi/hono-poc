import { serve } from "@hono/node-server"
import { Hono } from "hono"
import type { AppEnv } from "./shared/app-env"
import { loadEnv } from "./shared/config/env"
import { createLogger } from "./shared/logger/logger"
import { registerRequestLogging } from "./shared/logger/request-logging"

const env = loadEnv()
const logger = createLogger(env)

const app = new Hono<AppEnv>()

app.get("/health", (c) => c.json({ status: "ok" }, 200))

registerRequestLogging(app, logger)

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info({ port: info.port }, "server started")
})
