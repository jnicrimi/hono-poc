import { Hono } from "hono"
import type { AppEnv } from "../../../shared/app-env"
import { registerErrorHandlers } from "../../../shared/error/register-error-handlers"
import { registerHttpBoundary } from "../../../shared/http/register-http-boundary"
import { createHttpBoundaryConfigStub } from "../../../shared/http/test-support/http-boundary-config-stub"
import { createLoggerStub } from "../../../shared/logger/test-support/logger-stub"
import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import type { BookReader } from "../application/book-reader"
import { CreateBook } from "../application/create-book"
import { DeleteBook } from "../application/delete-book"
import { GetBookById } from "../application/get-book-by-id"
import { ListBooks } from "../application/list-books"
import { UpdateBook } from "../application/update-book"
import type { BookRepository } from "../domain/book-repository"
import { createBookRouter } from "../presentation/book-router"
import { createBookUnitOfWorkStub } from "./book-unit-of-work-stub"

type Deps = {
  readonly repository: BookRepository
  readonly reader: BookReader
  readonly authorReader: AuthorExistenceReader
}

export const createBookTestApp = (deps: Deps) => {
  const uow = createBookUnitOfWorkStub({
    repository: deps.repository,
    authorReader: deps.authorReader,
  })
  const router = createBookRouter({
    createBook: new CreateBook(uow),
    listBooks: new ListBooks(deps.reader),
    getBookById: new GetBookById(deps.reader),
    updateBook: new UpdateBook(uow),
    deleteBook: new DeleteBook(deps.repository),
  })

  const app = new Hono<AppEnv>()
  registerErrorHandlers(app, createLoggerStub())
  registerHttpBoundary(app, createHttpBoundaryConfigStub())
  return app.route("/books", router)
}
