import { inArray } from "drizzle-orm"
import type { Db } from "../../../../shared/db/client"
import { AuthorId } from "../../domain/author-id"
import { authors } from "../../infrastructure/schema"
import type { AuthorExistenceReader } from "../application/author-existence-reader"

export class DrizzleAuthorExistenceReader implements AuthorExistenceReader {
  constructor(private readonly db: Db) {}

  async findExistingIds(
    ids: readonly AuthorId[],
  ): Promise<readonly AuthorId[]> {
    if (ids.length === 0) {
      return []
    }
    const rows = await this.db
      .select({ id: authors.id })
      .from(authors)
      .where(
        inArray(
          authors.id,
          ids.map((id) => id.value),
        ),
      )
    return rows.map((row) => AuthorId.restore(row.id))
  }
}
