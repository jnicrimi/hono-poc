import type { OpenAPIHono } from "@hono/zod-openapi"
import { CreateBook } from "../../modules/book/application/create-book"
import { DeleteBook } from "../../modules/book/application/delete-book"
import { GetBookById } from "../../modules/book/application/get-book-by-id"
import { ListBooks } from "../../modules/book/application/list-books"
import { UpdateBook } from "../../modules/book/application/update-book"
import { DrizzleBookReader } from "../../modules/book/infrastructure/drizzle-book-reader"
import { DrizzleBookRepository } from "../../modules/book/infrastructure/drizzle-book-repository"
import { createBookRouter } from "../../modules/book/presentation/book-router"
import type { AppEnv } from "../app-env"
import type { Db } from "../db/client"

export const registerBookModule = (app: OpenAPIHono<AppEnv>, db: Db) => {
  const repository = new DrizzleBookRepository(db)
  const reader = new DrizzleBookReader(db)

  const router = createBookRouter({
    createBook: new CreateBook(repository),
    listBooks: new ListBooks(reader),
    getBookById: new GetBookById(reader),
    updateBook: new UpdateBook(repository),
    deleteBook: new DeleteBook(repository),
  })

  app.route("/books", router)
}
