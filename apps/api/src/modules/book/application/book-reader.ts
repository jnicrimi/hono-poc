import type { BookId } from "../domain/book-id"

export type BookReadModel = {
  readonly id: string
  readonly title: string
  readonly version: number
}

export interface BookReader {
  findById(id: BookId): Promise<BookReadModel | null>
  findMany(params: {
    readonly limit: number
    readonly offset: number
  }): Promise<{
    readonly items: readonly BookReadModel[]
    readonly total: number
  }>
}
