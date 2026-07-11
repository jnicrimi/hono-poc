import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import type { BookReader, BookReadModel } from "./book-reader"

export type ShowBookQuery = { readonly id: string }
export type ShowBookResult = BookReadModel

export class ShowBook {
  constructor(private readonly reader: BookReader) {}

  async execute(query: ShowBookQuery): Promise<ShowBookResult> {
    const book = await this.reader.findById(BookId.restore(query.id))
    if (!book) {
      throw new BookNotFoundError()
    }
    return book
  }
}
