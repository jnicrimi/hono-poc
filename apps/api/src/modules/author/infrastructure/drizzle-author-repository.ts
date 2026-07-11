import { and, eq, sql } from "drizzle-orm"
import type { Db } from "../../../shared/db/client"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { Author } from "../domain/author"
import { authorEntityLabel } from "../domain/author-entity-label"
import { AuthorId } from "../domain/author-id"
import { AuthorInUseError } from "../domain/author-in-use-error"
import { AuthorName } from "../domain/author-name"
import type { AuthorRepository } from "../domain/author-repository"
import { authors } from "./schema"

// SQLSTATE 23001 = restrict_violation（ON DELETE RESTRICT の違反）
const RESTRICT_VIOLATION = "23001"

const isRestrictViolation = (error: unknown): boolean =>
  error instanceof Error &&
  typeof error.cause === "object" &&
  error.cause !== null &&
  "code" in error.cause &&
  error.cause.code === RESTRICT_VIOLATION

export class DrizzleAuthorRepository implements AuthorRepository {
  constructor(private readonly db: Db) {}

  async findById(id: AuthorId): Promise<Author | null> {
    const rows = await this.db
      .select({
        id: authors.id,
        name: authors.name,
        version: authors.version,
      })
      .from(authors)
      .where(eq(authors.id, id.value))
      .limit(1)
    const row = rows[0]
    if (!row) {
      return null
    }
    try {
      return Author.reconstruct({
        id: AuthorId.restore(row.id),
        name: AuthorName.from(row.name),
        version: row.version,
      })
    } catch (error) {
      throw new Error(`著者データの復元に失敗しました: ${row.id}`, {
        cause: error,
      })
    }
  }

  async insert(author: Author): Promise<void> {
    await this.db.insert(authors).values({
      id: author.id.value,
      name: author.name.value,
      version: author.version,
    })
  }

  async update(author: Author, expectedVersion: number): Promise<Author> {
    const updated = await this.db
      .update(authors)
      .set({
        name: author.name.value,
        version: sql`${authors.version} + 1`,
      })
      .where(
        and(
          eq(authors.id, author.id.value),
          eq(authors.version, expectedVersion),
        ),
      )
      .returning({ version: authors.version })
    const row = updated[0]
    if (!row) {
      throw new OptimisticLockError(authorEntityLabel)
    }
    return Author.reconstruct({ ...author, version: row.version })
  }

  async delete(id: AuthorId): Promise<void> {
    try {
      await this.db.delete(authors).where(eq(authors.id, id.value))
    } catch (error) {
      if (isRestrictViolation(error)) {
        // biome-ignore lint/style/useErrorCause: cause is passed via the constructor's first argument
        throw new AuthorInUseError({ cause: error })
      }
      throw error
    }
  }
}
