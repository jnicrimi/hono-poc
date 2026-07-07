import { buildPaginationMeta } from "../../../shared/pagination/build-pagination-meta"
import type { Paginated } from "../../../shared/pagination/paginated"
import { toLimitOffset } from "../../../shared/pagination/to-limit-offset"
import type { BookReader, BookReadModel } from "./book-reader"

export type ListBooksQuery = {
  readonly page: number
  readonly perPage: number
}
export type ListBooksResult = Paginated<BookReadModel>

export class ListBooks {
  constructor(private readonly reader: BookReader) {}

  async execute(query: ListBooksQuery): Promise<ListBooksResult> {
    const { limit, offset } = toLimitOffset({
      page: query.page,
      perPage: query.perPage,
    })
    const { items, total } = await this.reader.findMany({ limit, offset })
    const pagination = buildPaginationMeta({
      page: query.page,
      perPage: query.perPage,
      total,
    })
    return { items, pagination }
  }
}
