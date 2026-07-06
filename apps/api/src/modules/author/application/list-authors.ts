import { buildPaginationMeta } from "../../../shared/pagination/build-pagination-meta"
import type { Paginated } from "../../../shared/pagination/paginated"
import { toLimitOffset } from "../../../shared/pagination/to-limit-offset"
import type { AuthorReader, AuthorReadModel } from "./author-reader"

export type ListAuthorsQuery = {
  readonly page: number
  readonly perPage: number
}
export type ListAuthorsResult = Paginated<AuthorReadModel>

export class ListAuthors {
  constructor(private readonly reader: AuthorReader) {}

  async execute(query: ListAuthorsQuery): Promise<ListAuthorsResult> {
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
