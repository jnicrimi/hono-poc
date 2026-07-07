import { createRoute } from "@hono/zod-openapi"
import { errorResponseSchema } from "../../../shared/error/error-response-schema"
import type { ApiTag } from "../../../shared/openapi/api-tags"
import { createOpenApiApp } from "../../../shared/openapi/create-openapi-app"
import type { CreateAuthor } from "../application/create-author"
import type { DeleteAuthor } from "../application/delete-author"
import type { GetAuthorById } from "../application/get-author-by-id"
import type { ListAuthors } from "../application/list-authors"
import type { UpdateAuthor } from "../application/update-author"
import { authorIdParamSchema } from "./author-id-param-schema"
import {
  authorResponseSchema,
  createAuthorResponseSchema,
  listAuthorsResponseSchema,
} from "./author-response-schema"
import { createAuthorSchema } from "./create-author-schema"
import { listAuthorsQuerySchema } from "./list-authors-query-schema"
import { updateAuthorSchema } from "./update-author-schema"

type AuthorRouterDeps = {
  readonly createAuthor: CreateAuthor
  readonly listAuthors: ListAuthors
  readonly getAuthorById: GetAuthorById
  readonly updateAuthor: UpdateAuthor
  readonly deleteAuthor: DeleteAuthor
}

const jsonError = (description: string) => ({
  content: { "application/json": { schema: errorResponseSchema } },
  description,
})

export const authorApiTag = {
  name: "Authors",
  description: "著者",
} as const satisfies ApiTag

const tags = [authorApiTag.name]

const createAuthorRoute = createRoute({
  tags,
  summary: "著者を作成",
  method: "post",
  path: "/",
  request: {
    body: {
      content: { "application/json": { schema: createAuthorSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: createAuthorResponseSchema } },
      description: "作成した著者の情報",
    },
    422: jsonError("リクエストボディが不正"),
  },
})

const listAuthorsRoute = createRoute({
  tags,
  summary: "著者一覧を取得",
  method: "get",
  path: "/",
  request: {
    query: listAuthorsQuerySchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: listAuthorsResponseSchema } },
      description: "著者の一覧",
    },
    400: jsonError("クエリパラメータが不正"),
  },
})

const getAuthorRoute = createRoute({
  tags,
  summary: "著者を取得",
  method: "get",
  path: "/{id}",
  request: {
    params: authorIdParamSchema,
  },
  responses: {
    200: {
      content: { "application/json": { schema: authorResponseSchema } },
      description: "著者の情報",
    },
    400: jsonError("パスパラメータが不正"),
    404: jsonError("著者が存在しない"),
  },
})

const updateAuthorRoute = createRoute({
  tags,
  summary: "著者を更新",
  method: "patch",
  path: "/{id}",
  request: {
    params: authorIdParamSchema,
    body: {
      content: { "application/json": { schema: updateAuthorSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: authorResponseSchema } },
      description: "更新後の著者の情報",
    },
    400: jsonError("パスパラメータが不正"),
    404: jsonError("著者が存在しない"),
    409: jsonError("バージョンが競合"),
    422: jsonError("リクエストボディが不正"),
  },
})

const deleteAuthorRoute = createRoute({
  tags,
  summary: "著者を削除",
  method: "delete",
  path: "/{id}",
  request: {
    params: authorIdParamSchema,
  },
  responses: {
    204: {
      description: "削除完了",
    },
    400: jsonError("パスパラメータが不正"),
    404: jsonError("著者が存在しない"),
  },
})

export const createAuthorRouter = (deps: AuthorRouterDeps) => {
  const router = createOpenApiApp()

  router.openapi(createAuthorRoute, async (c) => {
    const { name } = c.req.valid("json")
    const created = await deps.createAuthor.execute({
      name,
    })
    return c.json(created, 201)
  })

  router.openapi(listAuthorsRoute, async (c) => {
    const query = c.req.valid("query")
    const result = await deps.listAuthors.execute(query)
    return c.json(result, 200)
  })

  router.openapi(getAuthorRoute, async (c) => {
    const { id } = c.req.valid("param")
    const author = await deps.getAuthorById.execute({ id })
    return c.json(author, 200)
  })

  router.openapi(updateAuthorRoute, async (c) => {
    const { id } = c.req.valid("param")
    const { name, version } = c.req.valid("json")
    const updated = await deps.updateAuthor.execute({ id, name, version })
    return c.json(updated, 200)
  })

  router.openapi(deleteAuthorRoute, async (c) => {
    const { id } = c.req.valid("param")
    await deps.deleteAuthor.execute({ id })
    return c.body(null, 204)
  })

  return router
}
