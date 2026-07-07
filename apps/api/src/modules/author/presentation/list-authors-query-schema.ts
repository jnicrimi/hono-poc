import { createPaginationQuerySchema } from "../../../shared/pagination/pagination-query-schema"

export const listAuthorsQuerySchema = createPaginationQuerySchema({
  defaultPerPage: 10,
  maxPerPage: 100,
})
