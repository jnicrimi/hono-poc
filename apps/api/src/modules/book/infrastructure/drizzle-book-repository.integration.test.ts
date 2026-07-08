import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import type { Db } from "../../../shared/db/client"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { AppError } from "../../../shared/error/app-error"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { AuthorId } from "../../author/domain/author-id"
import { authors } from "../../author/infrastructure/schema"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookTitle } from "../domain/book-title"
import { DrizzleBookRepository } from "./drizzle-book-repository"
import { books } from "./schema"

const seedAuthor = async (tx: Db): Promise<AuthorId> => {
  const id = crypto.randomUUID()
  await tx.insert(authors).values({ id, name: "著者名" })
  return AuthorId.restore(id)
}

describe("DrizzleBookRepository", () => {
  describe("findById", () => {
    it("存在しない場合は null を返す", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const found = await repository.findById(BookId.generate())
        expect(found).toBeNull()
      }))

    it("レコードが破損している場合はエラーを投げる", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await repository.insert(book)
        await tx
          .update(books)
          .set({ title: "" })
          .where(eq(books.id, book.id.value))
        const error = await repository.findById(book.id).catch((e) => e)
        expect(error).toBeInstanceOf(Error)
        expect(error).not.toBeInstanceOf(AppError)
      }))
  })

  describe("insert", () => {
    it("保存した entity をそのまま復元する", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await repository.insert(book)
        const found = await repository.findById(book.id)
        expect(found).toEqual(book)
      }))

    it("複数の authorIds を保存した entity をそのまま復元する", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const authorIds = [await seedAuthor(tx), await seedAuthor(tx)].sort(
          (a, b) => (a.value < b.value ? -1 : 1),
        )
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds,
        })
        await repository.insert(book)
        const found = await repository.findById(book.id)
        expect(found).toEqual(book)
      }))
  })

  describe("update", () => {
    it("title を更新し version を 1 増やす", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await repository.insert(book)
        const updated = book.update({
          title: BookTitle.from("更新後の書籍タイトル"),
          authorIds: book.authorIds,
        })
        const result = await repository.update(updated, updated.version)
        const expected = await repository.findById(updated.id)
        expect(result).toEqual(expected)
        expect(result.version).toBe(book.version + 1)
      }))

    it("authorIds を置換する", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const before1 = await seedAuthor(tx)
        const before2 = await seedAuthor(tx)
        const after = await seedAuthor(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [before1, before2],
        })
        await repository.insert(book)
        await repository.update(
          book.update({ title: book.title, authorIds: [after] }),
          book.version,
        )
        const found = await repository.findById(book.id)
        expect(found?.authorIds.map((id) => id.value)).toEqual([after.value])
      }))

    it("version 不一致の場合は OptimisticLockError を投げる", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await repository.insert(book)
        await expect(
          repository.update(
            book.update({
              title: BookTitle.from("更新後の書籍タイトル"),
              authorIds: book.authorIds,
            }),
            99,
          ),
        ).rejects.toThrow(OptimisticLockError)
      }))
  })

  describe("delete", () => {
    it("削除後は findById が null を返す", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: [await seedAuthor(tx)],
        })
        await repository.insert(book)
        await repository.delete(book.id)
        const found = await repository.findById(book.id)
        expect(found).toBeNull()
      }))
  })
})
