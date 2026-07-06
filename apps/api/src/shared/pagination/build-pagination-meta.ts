import type { PaginationMeta } from "./paginated"

export const buildPaginationMeta = (params: {
  readonly page: number
  readonly perPage: number
  readonly total: number
}): PaginationMeta => ({
  ...params,
  totalPages: Math.ceil(params.total / params.perPage),
})
