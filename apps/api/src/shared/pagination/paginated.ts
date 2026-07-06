export type PaginationMeta = {
  readonly page: number
  readonly perPage: number
  readonly total: number
  readonly totalPages: number
}

export type Paginated<T> = {
  readonly items: readonly T[]
  readonly pagination: PaginationMeta
}
