import { createPaginationQuerySchema } from "../../../shared/pagination/pagination-query-schema"

export const listBooksQuerySchema = createPaginationQuerySchema({
  defaultPerPage: 10,
  maxPerPage: 100,
})
