import { eq } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { AppError } from "../../../shared/error/app-error"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import { Author } from "../domain/author"
import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { DrizzleAuthorRepository } from "./drizzle-author-repository"
import { authors } from "./schema"

describe("DrizzleAuthorRepository", () => {
  describe("findById", () => {
    it("存在しない場合は null を返す", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const found = await repository.findById(AuthorId.generate())
        expect(found).toBeNull()
      }))

    it("レコードが破損している場合はエラーを投げる", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const author = Author.create({
          name: AuthorName.from("著者名"),
        })
        await repository.insert(author)
        await tx
          .update(authors)
          .set({ name: "" })
          .where(eq(authors.id, author.id.value))
        const error = await repository.findById(author.id).catch((e) => e)
        expect(error).toBeInstanceOf(Error)
        expect(error).not.toBeInstanceOf(AppError)
      }))
  })

  describe("insert", () => {
    it("保存した entity をそのまま復元する", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const author = Author.create({
          name: AuthorName.from("著者名"),
        })
        await repository.insert(author)
        const found = await repository.findById(author.id)
        expect(found).toEqual(author)
      }))
  })

  describe("update", () => {
    it("name を更新し version を 1 増やす", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const author = Author.create({
          name: AuthorName.from("著者名"),
        })
        await repository.insert(author)
        const updated = author.update({
          name: AuthorName.from("更新後の著者名"),
        })
        const result = await repository.update(updated, updated.version)
        const expected = await repository.findById(updated.id)
        expect(result).toEqual(expected)
        expect(result.version).toBe(author.version + 1)
      }))

    it("version 不一致の場合は OptimisticLockError を投げる", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const author = Author.create({
          name: AuthorName.from("著者名"),
        })
        await repository.insert(author)
        await expect(
          repository.update(
            author.update({ name: AuthorName.from("更新後の著者名") }),
            99,
          ),
        ).rejects.toThrow(OptimisticLockError)
      }))
  })

  describe("delete", () => {
    it("削除後は findById が null を返す", () =>
      runInRollback(async (tx) => {
        const repository = new DrizzleAuthorRepository(tx)
        const author = Author.create({
          name: AuthorName.from("著者名"),
        })
        await repository.insert(author)
        await repository.delete(author.id)
        const found = await repository.findById(author.id)
        expect(found).toBeNull()
      }))
  })
})
