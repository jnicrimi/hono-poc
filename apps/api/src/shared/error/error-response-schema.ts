import { z } from "@hono/zod-openapi"

const errorDetailSchema = z
  .object({
    field: z.string().optional().openapi({ description: "対象フィールド" }),
    message: z.string().openapi({ description: "エラーメッセージ" }),
  })
  .openapi("ErrorDetail", { description: "エラー詳細" })

export const errorResponseSchema = z
  .object({
    errors: z
      .array(errorDetailSchema)
      .min(1)
      .openapi({ description: "エラー一覧" }),
  })
  .openapi("ErrorResponse", { description: "エラーレスポンス" })
