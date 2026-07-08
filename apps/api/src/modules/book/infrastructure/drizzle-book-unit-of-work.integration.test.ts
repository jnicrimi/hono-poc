import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import type { Db } from "../../../shared/db/client"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { DrizzleAuthorExistenceReader } from "../../author/contract/infrastructure/drizzle-author-existence-reader"
import { AuthorId } from "../../author/domain/author-id"
import { authors } from "../../author/infrastructure/schema"
import { Book } from "../domain/book"
import { BookTitle } from "../domain/book-title"
import { DrizzleBookRepository } from "./drizzle-book-repository"
import { DrizzleBookUnitOfWork } from "./drizzle-book-unit-of-work"
import { bookAuthors, books } from "./schema"

const seedAuthor = async (tx: Db): Promise<AuthorId> => {
  const id = crypto.randomUUID()
  await tx.insert(authors).values({ id, name: "著者名" })
  return AuthorId.restore(id)
}

const createUow = (tx: Db) =>
  new DrizzleBookUnitOfWork(tx, (d) => new DrizzleAuthorExistenceReader(d))

describe("DrizzleBookUnitOfWork", () => {
  describe("run", () => {
    it("正常完了すると書き込みが反映される", () =>
      runInRollback(async (tx) => {
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await createUow(tx).run(async ({ repository }) => {
          await repository.insert(book)
        })
        const found = await new DrizzleBookRepository(tx).findById(book.id)
        expect(found).toEqual(book)
      }))

    it("途中で throw すると books と book_authors がロールバックされる", () =>
      runInRollback(async (tx) => {
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        const error = await createUow(tx)
          .run(async ({ repository }) => {
            await repository.insert(book)
            throw new Error("boom")
          })
          .catch((e) => e)
        expect(error).toBeInstanceOf(Error)
        const bookRows = await tx
          .select()
          .from(books)
          .where(eq(books.id, book.id.value))
        const joinRows = await tx
          .select()
          .from(bookAuthors)
          .where(eq(bookAuthors.bookId, book.id.value))
        expect(bookRows).toEqual([])
        expect(joinRows).toEqual([])
      }))

    it("著者が存在しなくなった場合は book も book_authors も残らない", () =>
      runInRollback(async (tx) => {
        const authorId = await seedAuthor(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [authorId],
        })
        const error = await createUow(tx)
          .run(async ({ repository }) => {
            // 存在確認の直後に author が削除されるケースを再現する
            await tx.delete(authors).where(eq(authors.id, authorId.value))
            await repository.insert(book)
          })
          .catch((e) => e)
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).cause).toMatchObject({ code: "23503" })
        const bookRows = await tx
          .select()
          .from(books)
          .where(eq(books.id, book.id.value))
        const joinRows = await tx
          .select()
          .from(bookAuthors)
          .where(eq(bookAuthors.bookId, book.id.value))
        expect(bookRows).toEqual([])
        expect(joinRows).toEqual([])
      }))
  })
})
