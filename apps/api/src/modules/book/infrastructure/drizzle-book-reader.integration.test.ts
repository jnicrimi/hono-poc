import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { authors } from "../../author/infrastructure/schema"
import { BookId } from "../domain/book-id"
import { DrizzleBookReader } from "./drizzle-book-reader"
import { bookAuthors, books } from "./schema"

describe("DrizzleBookReader", () => {
  describe("findById", () => {
    it("row の値をそのまま ReadModel として返す", () =>
      runInRollback(async (tx) => {
        const id = crypto.randomUUID()
        const title = "書籍タイトル"
        await tx.insert(books).values({
          id,
          title,
          version: 2,
        })
        const reader = new DrizzleBookReader(tx)
        const found = await reader.findById(BookId.restore(id))
        expect(found).toEqual({
          id,
          title,
          authors: [],
          version: 2,
        })
      }))

    it("存在しない場合は null を返す", () =>
      runInRollback(async (tx) => {
        const reader = new DrizzleBookReader(tx)
        const found = await reader.findById(BookId.generate())
        expect(found).toBeNull()
      }))

    it("authors を name 昇順で返す", () =>
      runInRollback(async (tx) => {
        const bookId = crypto.randomUUID()
        const authorId1 = crypto.randomUUID()
        const authorId2 = crypto.randomUUID()
        await tx.insert(authors).values([
          { id: authorId1, name: "著者名B" },
          { id: authorId2, name: "著者名A" },
        ])
        await tx.insert(books).values({ id: bookId, title: "書籍タイトル" })
        await tx.insert(bookAuthors).values([
          { bookId, authorId: authorId1 },
          { bookId, authorId: authorId2 },
        ])
        const reader = new DrizzleBookReader(tx)
        const found = await reader.findById(BookId.restore(bookId))
        expect(found?.authors).toEqual([
          { id: authorId2, name: "著者名A" },
          { id: authorId1, name: "著者名B" },
        ])
      }))

    it("同名の著者は id 昇順で返す", () =>
      runInRollback(async (tx) => {
        const bookId = crypto.randomUUID()
        const authorIds = [crypto.randomUUID(), crypto.randomUUID()].sort()
        await tx
          .insert(authors)
          .values(authorIds.map((id) => ({ id, name: "著者名" })))
        await tx.insert(books).values({ id: bookId, title: "書籍タイトル" })
        await tx
          .insert(bookAuthors)
          .values(authorIds.map((authorId) => ({ bookId, authorId })))
        const reader = new DrizzleBookReader(tx)
        const found = await reader.findById(BookId.restore(bookId))
        expect(found?.authors).toEqual(
          authorIds.map((id) => ({ id, name: "著者名" })),
        )
      }))
  })

  describe("findMany", () => {
    const seedRows = [
      {
        id: "01920000-0000-7000-8000-000000000002",
        title: "書籍2",
        version: 0,
      },
      {
        id: "01920000-0000-7000-8000-000000000003",
        title: "書籍3",
        version: 0,
      },
      {
        id: "01920000-0000-7000-8000-000000000001",
        title: "書籍1",
        version: 0,
      },
    ]

    it("id 昇順の items と全件数の total を返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(books).values(seedRows)
        const reader = new DrizzleBookReader(tx)
        const result = await reader.findMany({ limit: 10, offset: 0 })
        expect(result).toEqual({
          items: [
            {
              id: "01920000-0000-7000-8000-000000000001",
              title: "書籍1",
              authors: [],
              version: 0,
            },
            {
              id: "01920000-0000-7000-8000-000000000002",
              title: "書籍2",
              authors: [],
              version: 0,
            },
            {
              id: "01920000-0000-7000-8000-000000000003",
              title: "書籍3",
              authors: [],
              version: 0,
            },
          ],
          total: 3,
        })
      }))

    it("先頭から offset 件を skip して limit 件だけを返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(books).values(seedRows)
        const reader = new DrizzleBookReader(tx)
        const result = await reader.findMany({ limit: 1, offset: 1 })
        expect(result).toEqual({
          items: [
            {
              id: "01920000-0000-7000-8000-000000000002",
              title: "書籍2",
              authors: [],
              version: 0,
            },
          ],
          total: 3,
        })
      }))

    it("offset が範囲外の場合は items は空で total は全件数を返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(books).values(seedRows)
        const reader = new DrizzleBookReader(tx)
        const result = await reader.findMany({ limit: 10, offset: 10 })
        expect(result).toEqual({ items: [], total: 3 })
      }))

    it("authors が正しい book に紐付く", () =>
      runInRollback(async (tx) => {
        const bookId1 = "01920000-0000-7000-8000-000000000001"
        const bookId2 = "01920000-0000-7000-8000-000000000002"
        const authorId1 = crypto.randomUUID()
        const authorId2 = crypto.randomUUID()
        await tx.insert(authors).values([
          { id: authorId1, name: "著者名1" },
          { id: authorId2, name: "著者名2" },
        ])
        await tx.insert(books).values([
          { id: bookId1, title: "書籍1" },
          { id: bookId2, title: "書籍2" },
        ])
        await tx.insert(bookAuthors).values([
          { bookId: bookId1, authorId: authorId1 },
          { bookId: bookId2, authorId: authorId2 },
        ])
        const reader = new DrizzleBookReader(tx)
        const result = await reader.findMany({ limit: 10, offset: 0 })
        expect(result.items.map((item) => item.authors)).toEqual([
          [{ id: authorId1, name: "著者名1" }],
          [{ id: authorId2, name: "著者名2" }],
        ])
      }))
  })
})
