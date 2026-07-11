import { z } from "@hono/zod-openapi"
import { paginationMetaSchema } from "../../../shared/pagination/pagination-meta-schema"

export const authorResponseSchema = z
  .object({
    id: z.uuid().openapi({ description: "著者ID" }),
    name: z.string().openapi({ description: "著者名" }),
    version: z.number().int().openapi({ description: "バージョン" }),
  })
  .openapi("Author", { description: "著者" })

export const listAuthorsResponseSchema = z
  .object({
    items: z
      .array(authorResponseSchema)
      .readonly()
      .openapi({ description: "著者の一覧" }),
    pagination: paginationMetaSchema,
  })
  .openapi("AuthorList", { description: "著者一覧のレスポンス" })
