import { authorApiTag } from "../../modules/author/presentation/author-router"
import type { Db } from "../db/client"
import { registerErrorHandlers } from "../error/register-error-handlers"
import { registerHealthCheck } from "../health/register-health-check"
import {
  type HttpBoundaryConfig,
  registerHttpBoundary,
} from "../http/register-http-boundary"
import type { AppLogger } from "../logger/logger"
import { registerRequestLogging } from "../logger/register-request-logging"
import { createOpenApiApp } from "../openapi/create-openapi-app"
import { registerOpenApiDocs } from "../openapi/register-openapi-docs"
import { registerAuthorModule } from "./register-author-module"

export const createApp = (
  db: Db,
  logger: AppLogger,
  options: {
    readonly enableApiDocs: boolean
    readonly httpBoundary: HttpBoundaryConfig
  },
) => {
  const app = createOpenApiApp()

  registerHealthCheck(app, db)
  registerRequestLogging(app, logger)
  registerErrorHandlers(app, logger)
  registerHttpBoundary(app, options.httpBoundary)
  registerAuthorModule(app, db)
  registerOpenApiDocs(app, {
    enabled: options.enableApiDocs,
    tags: [authorApiTag],
  })

  return app
}
