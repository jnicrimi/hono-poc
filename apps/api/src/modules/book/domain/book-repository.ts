import type { Book } from "./book"
import type { BookId } from "./book-id"

export interface BookRepository {
  findById(id: BookId): Promise<Book | null>
  insert(book: Book): Promise<void>
  update(book: Book, expectedVersion: number): Promise<Book>
  delete(id: BookId): Promise<void>
}
