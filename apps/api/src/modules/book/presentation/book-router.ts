import { createRoute } from "@hono/zod-openapi"
import { errorResponseSchema } from "../../../shared/error/error-response-schema"
import type { ApiTag } from "../../../shared/openapi/api-tags"
import { createOpenApiApp } from "../../../shared/openapi/create-openapi-app"
import type { CreateBook } from "../application/create-book"
import type { DeleteBook } from "../application/delete-book"
import type { GetBookById } from "../application/get-book-by-id"
import type { ListBooks } from "../application/list-books"
import type { UpdateBook } from "../application/update-book"
import { bookIdParamSchema } from "./book-id-param-schema"
import {
  bookResponseSchema,
  createBookResponseSchema,
  listBooksResponseSchema,
  updateBookResponseSchema,
} from "./book-response-schema"
import { createBookSchema } from "./create-book-schema"
import { listBooksQuerySchema } from "./list-books-query-schema"
import { updateBookSchema } from "./update-book-schema"

type BookRouterDeps = {
  readonly createBook: CreateBook
  readonly listBooks: ListBooks
  readonly getBookById: GetBookById
  readonly updateBook: UpdateBook
  readonly deleteBook: DeleteBook
}

const jsonError = (description: string) => ({
  content: { "application/json": { schema: errorResponseSchema } },
  description,
})

export const bookApiTag = {
  name: "Books",
  description: "書籍",
} as const satisfies ApiTag

const tags = [bookApiTag.name]

const createBookRoute = createRoute({
  tags,
  summary: "書籍を作成",
  method: "post",
  path: "/",
  request: {
    body: {
      content: { "application/json": { schema: createBookSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: createBookResponseSchema } },
      description: "作成した書籍の情報",
    },
    400: jsonError("著者が存在しない"),
    422: jsonError("リクエストボディが不正"),
  },
})

const listBooksRoute = createRoute({
  tags,
  summary: "書籍一覧を取得",
  method: "get",
  path: "/",
  request: {
    query: listBooksQuerySchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: listBooksResponseSchema } },
      description: "書籍の一覧",
    },
    400: jsonError("クエリパラメータが不正"),
  },
})

const getBookRoute = createRoute({
  tags,
  summary: "書籍を取得",
  method: "get",
  path: "/{id}",
  request: {
    params: bookIdParamSchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: bookResponseSchema } },
      description: "書籍の情報",
    },
    400: jsonError("パスパラメータが不正"),
    404: jsonError("書籍が存在しない"),
  },
})

const updateBookRoute = createRoute({
  tags,
  summary: "書籍を更新",
  method: "patch",
  path: "/{id}",
  request: {
    params: bookIdParamSchema,
    body: {
      content: { "application/json": { schema: updateBookSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: updateBookResponseSchema } },
      description: "更新後の書籍の情報",
    },
    400: jsonError("パスパラメータが不正、または著者が存在しない"),
    404: jsonError("書籍が存在しない"),
    409: jsonError("バージョンが競合"),
    422: jsonError("リクエストボディが不正"),
  },
})

const deleteBookRoute = createRoute({
  tags,
  summary: "書籍を削除",
  method: "delete",
  path: "/{id}",
  request: {
    params: bookIdParamSchema,
  },
  responses: {
    204: {
      description: "削除完了",
    },
    400: jsonError("パスパラメータが不正"),
    404: jsonError("書籍が存在しない"),
  },
})

export const createBookRouter = (deps: BookRouterDeps) => {
  const router = createOpenApiApp()

  router.openapi(createBookRoute, async (c) => {
    const { title, authorIds } = c.req.valid("json")
    const created = await deps.createBook.execute({
      title,
      authorIds,
    })
    return c.json(created, 201)
  })

  router.openapi(listBooksRoute, async (c) => {
    const query = c.req.valid("query")
    const result = await deps.listBooks.execute(query)
    return c.json(result, 200)
  })

  router.openapi(getBookRoute, async (c) => {
    const { id } = c.req.valid("param")
    const book = await deps.getBookById.execute({ id })
    return c.json(book, 200)
  })

  router.openapi(updateBookRoute, async (c) => {
    const { id } = c.req.valid("param")
    const { title, authorIds, version } = c.req.valid("json")
    const updated = await deps.updateBook.execute({
      id,
      title,
      authorIds,
      version,
    })
    return c.json(updated, 200)
  })

  router.openapi(deleteBookRoute, async (c) => {
    const { id } = c.req.valid("param")
    await deps.deleteBook.execute({ id })
    return c.body(null, 204)
  })

  return router
}
