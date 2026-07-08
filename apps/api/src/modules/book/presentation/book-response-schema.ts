import { z } from "@hono/zod-openapi"
import { paginationMetaSchema } from "../../../shared/pagination/pagination-meta-schema"

export const bookResponseSchema = z
  .object({
    id: z.uuid().openapi({ description: "書籍ID" }),
    title: z.string().openapi({ description: "書籍タイトル" }),
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

export const createBookResponseSchema = z
  .object({
    id: z.uuid().openapi({ description: "作成した書籍のID" }),
  })
  .openapi("CreateBookResult", { description: "書籍の作成結果" })

export const updateBookResponseSchema = z
  .object({
    id: z.uuid().openapi({ description: "書籍ID" }),
    title: z.string().openapi({ description: "書籍タイトル" }),
    authorIds: z
      .array(z.uuid())
      .readonly()
      .openapi({ description: "著者IDの一覧" }),
    version: z.number().int().openapi({ description: "バージョン" }),
  })
  .openapi("UpdateBookResult", { description: "書籍の更新結果" })
