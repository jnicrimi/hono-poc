import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { AppError } from "../../../shared/error/app-error"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookTitle } from "../domain/book-title"
import { DrizzleBookRepository } from "./drizzle-book-repository"
import { books } from "./schema"

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
        })
        await repository.insert(book)
        const updated = book.update({
          title: BookTitle.from("更新後の書籍タイトル"),
        })
        const result = await repository.update(updated, updated.version)
        const expected = await repository.findById(updated.id)
        expect(result).toEqual(expected)
        expect(result.version).toBe(book.version + 1)
      }))

    it("version 不一致の場合は OptimisticLockError を投げる", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleBookRepository(tx)
        const book = Book.create({
          title: BookTitle.from("書籍タイトル"),
        })
        await repository.insert(book)
        await expect(
          repository.update(
            book.update({ title: BookTitle.from("更新後の書籍タイトル") }),
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
        })
        await repository.insert(book)
        await repository.delete(book.id)
        const found = await repository.findById(book.id)
        expect(found).toBeNull()
      }))
  })
})
