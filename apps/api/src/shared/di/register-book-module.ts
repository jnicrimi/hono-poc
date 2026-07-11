import type { OpenAPIHono } from "@hono/zod-openapi"
import { DrizzleAuthorExistenceReader } from "../../modules/author/contract/infrastructure/drizzle-author-existence-reader"
import { CreateBook } from "../../modules/book/application/create-book"
import { DeleteBook } from "../../modules/book/application/delete-book"
import { ListBooks } from "../../modules/book/application/list-books"
import { ShowBook } from "../../modules/book/application/show-book"
import { UpdateBook } from "../../modules/book/application/update-book"
import { DrizzleBookReader } from "../../modules/book/infrastructure/drizzle-book-reader"
import { DrizzleBookRepository } from "../../modules/book/infrastructure/drizzle-book-repository"
import { DrizzleBookUnitOfWork } from "../../modules/book/infrastructure/drizzle-book-unit-of-work"
import { createBookRouter } from "../../modules/book/presentation/book-router"
import type { AppEnv } from "../app-env"
import type { Db } from "../db/client"

export const registerBookModule = (app: OpenAPIHono<AppEnv>, db: Db) => {
  const repository = new DrizzleBookRepository(db)
  const reader = new DrizzleBookReader(db)
  const uow = new DrizzleBookUnitOfWork(
    db,
    (d) => new DrizzleAuthorExistenceReader(d),
  )

  const router = createBookRouter({
    createBook: new CreateBook(uow),
    listBooks: new ListBooks(reader),
    showBook: new ShowBook(reader),
    updateBook: new UpdateBook(uow),
    deleteBook: new DeleteBook(repository),
  })

  app.route("/books", router)
}
