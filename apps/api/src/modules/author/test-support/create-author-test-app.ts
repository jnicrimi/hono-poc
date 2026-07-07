import { Hono } from "hono"
import type { AppEnv } from "../../../shared/app-env"
import { registerErrorHandlers } from "../../../shared/error/error-handlers"
import { createLoggerStub } from "../../../shared/logger/test-support/logger-stub"
import type { AuthorReader } from "../application/author-reader"
import { CreateAuthor } from "../application/create-author"
import { DeleteAuthor } from "../application/delete-author"
import { GetAuthorById } from "../application/get-author-by-id"
import { ListAuthors } from "../application/list-authors"
import { UpdateAuthor } from "../application/update-author"
import type { AuthorRepository } from "../domain/author-repository"
import { createAuthorRouter } from "../presentation/author-router"

type Deps = {
  readonly repository: AuthorRepository
  readonly reader: AuthorReader
}

export const createAuthorTestApp = (deps: Deps) => {
  const router = createAuthorRouter({
    createAuthor: new CreateAuthor(deps.repository),
    getAuthorById: new GetAuthorById(deps.reader),
    listAuthors: new ListAuthors(deps.reader),
    updateAuthor: new UpdateAuthor(deps.repository),
    deleteAuthor: new DeleteAuthor(deps.repository),
  })

  const app = new Hono<AppEnv>()
  registerErrorHandlers(app, createLoggerStub())
  return app.route("/authors", router)
}
