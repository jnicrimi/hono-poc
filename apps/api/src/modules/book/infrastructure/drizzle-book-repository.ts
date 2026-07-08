import { and, asc, eq, sql } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { AuthorId } from "../../author/domain/author-id"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"
import { bookAuthors, books } from "./schema"

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
    const authorRows = await this.db
      .select({ authorId: bookAuthors.authorId })
      .from(bookAuthors)
      .where(eq(bookAuthors.bookId, id.value))
      .orderBy(asc(bookAuthors.authorId))
    try {
      return Book.reconstruct({
        id: BookId.restore(row.id),
        title: BookTitle.from(row.title),
        authorIds: authorRows.map((authorRow) =>
          AuthorId.restore(authorRow.authorId),
        ),
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
    await this.insertBookAuthors(book)
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
    await this.db
      .delete(bookAuthors)
      .where(eq(bookAuthors.bookId, book.id.value))
    await this.insertBookAuthors(book)
    return Book.reconstruct({ ...book, version: row.version })
  }

  async delete(id: BookId): Promise<void> {
    await this.db.delete(books).where(eq(books.id, id.value))
  }

  private async insertBookAuthors(book: Book): Promise<void> {
    if (book.authorIds.length === 0) {
      return
    }
    await this.db.insert(bookAuthors).values(
      book.authorIds.map((authorId) => ({
        bookId: book.id.value,
        authorId: authorId.value,
      })),
    )
  }
}
