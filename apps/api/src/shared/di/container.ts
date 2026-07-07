import { authorApiTag } from "../../modules/author/presentation/author-router"
import type { Db } from "../db/client"
import { registerErrorHandlers } from "../error/error-handlers"
import type { AppLogger } from "../logger/logger"
import { registerRequestLogging } from "../logger/request-logging"
import { createOpenApiApp } from "../openapi/create-openapi-app"
import { registerOpenApiDocs } from "../openapi/register-openapi-docs"
import { registerAuthorModule } from "./register-author-module"

export const createApp = (
  db: Db,
  logger: AppLogger,
  options: { readonly enableApiDocs: boolean },
) => {
  const app = createOpenApiApp()

  app.get("/health", (c) => c.json({ status: "ok" }, 200))

  registerRequestLogging(app, logger)
  registerErrorHandlers(app, logger)
  registerAuthorModule(app, db)
  registerOpenApiDocs(app, {
    enabled: options.enableApiDocs,
    tags: [authorApiTag],
  })

  return app
}
