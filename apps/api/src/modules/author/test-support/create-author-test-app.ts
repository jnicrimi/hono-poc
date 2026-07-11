import { Hono } from "hono"
import type { AppEnv } from "../../../shared/app-env"
import { registerErrorHandlers } from "../../../shared/error/register-error-handlers"
import { registerHttpBoundary } from "../../../shared/http/register-http-boundary"
import { createHttpBoundaryConfigStub } from "../../../shared/http/test-support/http-boundary-config-stub"
import { createLoggerStub } from "../../../shared/logger/test-support/logger-stub"
import type { AuthorReader } from "../application/author-reader"
import { CreateAuthor } from "../application/create-author"
import { DeleteAuthor } from "../application/delete-author"
import { ListAuthors } from "../application/list-authors"
import { ShowAuthor } from "../application/show-author"
import { UpdateAuthor } from "../application/update-author"
import type { AuthorRepository } from "../domain/author-repository"
import { createAuthorRouter } from "../presentation/author-router"

type Deps = {
  readonly repository: AuthorRepository
  readonly reader: AuthorReader
}

export const createAuthorTestApp = (deps: Deps) => {
  const router = createAuthorRouter({
    createAuthor: new CreateAuthor(deps.repository, deps.reader),
    listAuthors: new ListAuthors(deps.reader),
    showAuthor: new ShowAuthor(deps.reader),
    updateAuthor: new UpdateAuthor(deps.repository, deps.reader),
    deleteAuthor: new DeleteAuthor(deps.repository),
  })

  const app = new Hono<AppEnv>()
  registerErrorHandlers(app, createLoggerStub())
  registerHttpBoundary(app, createHttpBoundaryConfigStub())
  return app.route("/authors", router)
}
