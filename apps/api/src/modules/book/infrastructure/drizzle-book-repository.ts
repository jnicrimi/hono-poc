import { and, eq, sql } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"
import { books } from "./schema"

export class DrizzleBookRepository implements BookRepository {
  constructor(private readonly db: Db) {}

  async findById(id: BookId): Promise<Book | null> {
    const rows = await this.db
      .select({
        id: books.id,
        title: books.title,
        version: books.version,
      })
      .from(books)
      .where(eq(books.id, id.value))
      .limit(1)
    const row = rows[0]
    if (!row) {
      return null
    }
    try {
      return Book.reconstruct({
        id: BookId.restore(row.id),
        title: BookTitle.from(row.title),
        version: row.version,
      })
    } catch (error) {
      throw new Error(`書籍データの復元に失敗しました: ${row.id}`, {
        cause: error,
      })
    }
  }

  async insert(book: Book): Promise<void> {
    await this.db.insert(books).values({
      id: book.id.value,
      title: book.title.value,
      version: book.version,
    })
  }

  async update(book: Book, expectedVersion: number): Promise<Book> {
    const updated = await this.db
      .update(books)
      .set({
        title: book.title.value,
        version: sql`${books.version} + 1`,
      })
      .where(
        and(eq(books.id, book.id.value), eq(books.version, expectedVersion)),
      )
      .returning({ version: books.version })
    const row = updated[0]
    if (!row) {
      throw new OptimisticLockError("book", book.id.value)
    }
    return Book.reconstruct({ ...book, version: row.version })
  }

  async delete(id: BookId): Promise<void> {
    await this.db.delete(books).where(eq(books.id, id.value))
  }
}
