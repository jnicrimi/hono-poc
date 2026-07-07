import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { BookId } from "../domain/book-id"
import { DrizzleBookReader } from "./drizzle-book-reader"
import { books } from "./schema"

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
          version: 2,
        })
      }))

    it("存在しない場合は null を返す", () =>
      runInRollback(async (tx) => {
        const reader = new DrizzleBookReader(tx)
        const found = await reader.findById(BookId.generate())
        expect(found).toBeNull()
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
              version: 0,
            },
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
  })
})
