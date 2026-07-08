import { asc, count, eq, inArray } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import { authors } from "../../author/infrastructure/schema"
import type {
  BookAuthorReadModel,
  BookReader,
  BookReadModel,
} from "../application/book-reader"
import type { BookId } from "../domain/book-id"
import { bookAuthors, books } from "./schema"

export class DrizzleBookReader implements BookReader {
  constructor(private readonly db: Db) {}

  async findById(id: BookId): Promise<BookReadModel | null> {
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
    const authorsByBookId = await this.findAuthorsByBookIds([row.id])
    return { ...row, authors: authorsByBookId.get(row.id) ?? [] }
  }

  async findMany(params: {
    readonly limit: number
    readonly offset: number
  }): Promise<{
    readonly items: readonly BookReadModel[]
    readonly total: number
  }> {
    const totalRows = await this.db.select({ total: count() }).from(books)
    const rows = await this.db
      .select({
        id: books.id,
        title: books.title,
        version: books.version,
      })
      .from(books)
      .orderBy(asc(books.id))
      .limit(params.limit)
      .offset(params.offset)
    const authorsByBookId = await this.findAuthorsByBookIds(
      rows.map((row) => row.id),
    )
    return {
      items: rows.map((row) => ({
        ...row,
        authors: authorsByBookId.get(row.id) ?? [],
      })),
      total: totalRows[0]?.total ?? 0,
    }
  }

  private async findAuthorsByBookIds(
    bookIds: readonly string[],
  ): Promise<Map<string, BookAuthorReadModel[]>> {
    const authorsByBookId = new Map<string, BookAuthorReadModel[]>()
    if (bookIds.length === 0) {
      return authorsByBookId
    }
    const rows = await this.db
      .select({
        bookId: bookAuthors.bookId,
        id: authors.id,
        name: authors.name,
      })
      .from(bookAuthors)
      .innerJoin(authors, eq(bookAuthors.authorId, authors.id))
      .where(inArray(bookAuthors.bookId, [...bookIds]))
      .orderBy(asc(authors.name), asc(authors.id))
    for (const row of rows) {
      const list = authorsByBookId.get(row.bookId) ?? []
      list.push({ id: row.id, name: row.name })
      authorsByBookId.set(row.bookId, list)
    }
    return authorsByBookId
  }
}
