import { z } from "@hono/zod-openapi"
import { validationMessages } from "../error/validation-messages"

const DEFAULT_PAGE = 1

const paginationFieldLabels = {
  page: "ページ",
  perPage: "表示件数",
} as const

const pageInvalid = validationMessages.invalidValue(paginationFieldLabels.page)
const perPageInvalid = validationMessages.invalidValue(
  paginationFieldLabels.perPage,
)

export const createPaginationQuerySchema = (options: {
  readonly defaultPerPage: number
  readonly maxPerPage: number
}) =>
  z.object({
    page: z.coerce
      .number(pageInvalid)
      .int(pageInvalid)
      .min(1, pageInvalid)
      .default(DEFAULT_PAGE)
      .openapi({
        param: { name: "page", in: "query" },
        description: "ページ番号",
        example: 1,
      }),
    perPage: z.coerce
      .number(perPageInvalid)
      .int(perPageInvalid)
      .min(1, perPageInvalid)
      .max(
        options.maxPerPage,
        validationMessages.maxCount(
          paginationFieldLabels.perPage,
          options.maxPerPage,
        ),
      )
      .default(options.defaultPerPage)
      .openapi({
        param: { name: "perPage", in: "query" },
        description: "1 ページあたりの件数",
        example: options.defaultPerPage,
      }),
  })
