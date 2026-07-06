import { asc, count, eq } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import type {
  AuthorReader,
  AuthorReadModel,
} from "../application/author-reader"
import type { AuthorId } from "../domain/author-id"
import { authors } from "./schema"

export class DrizzleAuthorReader implements AuthorReader {
  constructor(private readonly db: Db) {}

  async findById(id: AuthorId): Promise<AuthorReadModel | null> {
    const rows = await this.db
      .select({
        id: authors.id,
        name: authors.name,
        version: authors.version,
      })
      .from(authors)
      .where(eq(authors.id, id.value))
      .limit(1)
    return rows[0] ?? null
  }

  async findMany(params: {
    readonly limit: number
    readonly offset: number
  }): Promise<{
    readonly items: readonly AuthorReadModel[]
    readonly total: number
  }> {
    const totalRows = await this.db.select({ total: count() }).from(authors)
    const items = await this.db
      .select({
        id: authors.id,
        name: authors.name,
        version: authors.version,
      })
      .from(authors)
      .orderBy(asc(authors.id))
      .limit(params.limit)
      .offset(params.offset)
    return {
      items,
      total: totalRows[0]?.total ?? 0,
    }
  }
}
