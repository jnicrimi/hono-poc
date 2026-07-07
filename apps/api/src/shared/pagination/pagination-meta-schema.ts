import { z } from "@hono/zod-openapi"

export const paginationMetaSchema = z
  .object({
    page: z.number().int().openapi({ description: "現在のページ番号" }),
    perPage: z.number().int().openapi({ description: "1 ページあたりの件数" }),
    total: z.number().int().openapi({ description: "総件数" }),
    totalPages: z.number().int().openapi({ description: "総ページ数" }),
  })
  .openapi("PaginationMeta", { description: "ページネーションのメタ情報" })
