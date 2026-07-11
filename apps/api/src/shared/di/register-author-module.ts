import type { OpenAPIHono } from "@hono/zod-openapi"
import { CreateAuthor } from "../../modules/author/application/create-author"
import { DeleteAuthor } from "../../modules/author/application/delete-author"
import { ListAuthors } from "../../modules/author/application/list-authors"
import { ShowAuthor } from "../../modules/author/application/show-author"
import { UpdateAuthor } from "../../modules/author/application/update-author"
import { DrizzleAuthorReader } from "../../modules/author/infrastructure/drizzle-author-reader"
import { DrizzleAuthorRepository } from "../../modules/author/infrastructure/drizzle-author-repository"
import { createAuthorRouter } from "../../modules/author/presentation/author-router"
import type { AppEnv } from "../app-env"
import type { Db } from "../db/client"

export const registerAuthorModule = (app: OpenAPIHono<AppEnv>, db: Db) => {
  const repository = new DrizzleAuthorRepository(db)
  const reader = new DrizzleAuthorReader(db)

  const router = createAuthorRouter({
    createAuthor: new CreateAuthor(repository, reader),
    listAuthors: new ListAuthors(reader),
    showAuthor: new ShowAuthor(reader),
    updateAuthor: new UpdateAuthor(repository, reader),
    deleteAuthor: new DeleteAuthor(repository),
  })

  app.route("/authors", router)
}
