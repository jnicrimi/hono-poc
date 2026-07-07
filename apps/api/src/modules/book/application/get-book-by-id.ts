import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import type { BookReader, BookReadModel } from "./book-reader"

export type GetBookByIdQuery = { readonly id: string }
export type GetBookByIdResult = BookReadModel

export class GetBookById {
  constructor(private readonly reader: BookReader) {}

  async execute(query: GetBookByIdQuery): Promise<GetBookByIdResult> {
    const book = await this.reader.findById(BookId.restore(query.id))
    if (!book) {
      throw new BookNotFoundError(query.id)
    }
    return book
  }
}
