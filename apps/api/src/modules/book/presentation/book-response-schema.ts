import { z } from "@hono/zod-openapi"
import { paginationMetaSchema } from "../../../shared/pagination/pagination-meta-schema"

const authorSummarySchema = z
  .object({
    id: z.uuid().openapi({ description: "著者ID" }),
    name: z.string().openapi({ description: "著者名" }),
  })
  .openapi("AuthorSummary", { description: "著者の要約" })

export const bookResponseSchema = z
  .object({
    id: z.uuid().openapi({ description: "書籍ID" }),
    title: z.string().openapi({ description: "書籍タイトル" }),
    authors: z
      .array(authorSummarySchema)
      .readonly()
      .openapi({ description: "著者の一覧" }),
    version: z.number().int().openapi({ description: "バージョン" }),
  })
  .openapi("Book", { description: "書籍" })

export const listBooksResponseSchema = z
  .object({
    items: z
      .array(bookResponseSchema)
      .readonly()
      .openapi({ description: "書籍の一覧" }),
    pagination: paginationMetaSchema,
  })
  .openapi("BookList", { description: "書籍一覧のレスポンス" })
