import { serve } from "@hono/node-server"
import { loadEnv } from "./shared/config/env"
import { registerErrorHandlers } from "./shared/error/error-handlers"
import { createLogger } from "./shared/logger/logger"
import { registerRequestLogging } from "./shared/logger/request-logging"
import { createOpenApiApp } from "./shared/openapi/create-openapi-app"
import { registerOpenApiDocs } from "./shared/openapi/register-openapi-docs"

const env = loadEnv()
const logger = createLogger(env)

const app = createOpenApiApp()

app.get("/health", (c) => c.json({ status: "ok" }, 200))

registerRequestLogging(app, logger)
registerErrorHandlers(app, logger)
registerOpenApiDocs(app, { enabled: env.NODE_ENV !== "production" })

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  logger.info({ port: info.port }, "server started")
})
