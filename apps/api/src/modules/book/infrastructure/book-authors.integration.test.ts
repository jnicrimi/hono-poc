import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { authors } from "../../author/infrastructure/schema"
import { bookAuthors, books } from "./schema"

describe("bookAuthors", () => {
  it("book を削除すると関連する行も削除される", () =>
    runInRollback(async (tx) => {
      const authorId = crypto.randomUUID()
      const bookId = crypto.randomUUID()
      await tx.insert(authors).values({
        id: authorId,
        name: "著者名",
      })
      await tx.insert(books).values({
        id: bookId,
        title: "書籍タイトル",
      })
      await tx.insert(bookAuthors).values({
        bookId: bookId,
        authorId: authorId,
      })
      await tx.delete(books).where(eq(books.id, bookId))
      const found = await tx
        .select()
        .from(bookAuthors)
        .where(eq(bookAuthors.bookId, bookId))
      expect(found).toHaveLength(0)
    }))

  it("author を削除すると関連する行も削除される", () =>
    runInRollback(async (tx) => {
      const authorId = crypto.randomUUID()
      const bookId = crypto.randomUUID()
      await tx.insert(authors).values({
        id: authorId,
        name: "著者名",
      })
      await tx.insert(books).values({
        id: bookId,
        title: "書籍タイトル",
      })
      await tx.insert(bookAuthors).values({
        bookId: bookId,
        authorId: authorId,
      })
      await tx.delete(authors).where(eq(authors.id, authorId))
      const found = await tx
        .select()
        .from(bookAuthors)
        .where(eq(bookAuthors.authorId, authorId))
      expect(found).toHaveLength(0)
    }))

  it("同じ組み合わせは重複登録できない", () =>
    runInRollback(async (tx) => {
      const authorId = crypto.randomUUID()
      const bookId = crypto.randomUUID()
      await tx.insert(authors).values({
        id: authorId,
        name: "著者名",
      })
      await tx.insert(books).values({
        id: bookId,
        title: "書籍タイトル",
      })
      await tx.insert(bookAuthors).values({
        bookId: bookId,
        authorId: authorId,
      })
      const error = await tx
        .insert(bookAuthors)
        .values({ bookId, authorId })
        .catch((e) => e)
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).cause).toMatchObject({ code: "23505" })
    }))
})
