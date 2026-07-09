import { authorApiTag } from "../../modules/author/presentation/author-router"
import { bookApiTag } from "../../modules/book/presentation/book-router"
import type { Db } from "../db/client"
import { registerErrorHandlers } from "../error/register-error-handlers"
import { registerHealthCheck } from "../health/register-health-check"
import { type CorsConfig, registerCors } from "../http/register-cors"
import {
  type HttpBoundaryConfig,
  registerHttpBoundary,
} from "../http/register-http-boundary"
import type { AppLogger } from "../logger/logger"
import { registerRequestLogging } from "../logger/register-request-logging"
import { createOpenApiApp } from "../openapi/create-openapi-app"
import { registerOpenApiDocs } from "../openapi/register-openapi-docs"
import { registerAuthorModule } from "./register-author-module"
import { registerBookModule } from "./register-book-module"

export const createApp = (
  db: Db,
  logger: AppLogger,
  options: {
    readonly enableApiDocs: boolean
    readonly cors: CorsConfig
    readonly httpBoundary: HttpBoundaryConfig
  },
) => {
  const app = createOpenApiApp()

  registerHealthCheck(app, db, logger)
  registerRequestLogging(app, logger)
  registerCors(app, options.cors)
  registerErrorHandlers(app, logger)
  registerHttpBoundary(app, options.httpBoundary)
  registerAuthorModule(app, db)
  registerBookModule(app, db)
  registerOpenApiDocs(app, {
    enabled: options.enableApiDocs,
    tags: [authorApiTag, bookApiTag],
  })

  return app
}
