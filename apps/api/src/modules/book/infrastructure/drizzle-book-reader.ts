import { asc, count, eq } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import type { BookReader, BookReadModel } from "../application/book-reader"
import type { BookId } from "../domain/book-id"
import { books } from "./schema"

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
    return rows[0] ?? null
  }

  async findMany(params: {
    readonly limit: number
    readonly offset: number
  }): Promise<{
    readonly items: readonly BookReadModel[]
    readonly total: number
  }> {
    const totalRows = await this.db.select({ total: count() }).from(books)
    const items = await this.db
      .select({
        id: books.id,
        title: books.title,
        version: books.version,
      })
      .from(books)
      .orderBy(asc(books.id))
      .limit(params.limit)
      .offset(params.offset)
    return {
      items,
      total: totalRows[0]?.total ?? 0,
    }
  }
}
