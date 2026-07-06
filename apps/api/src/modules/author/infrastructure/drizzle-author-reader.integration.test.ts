import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../shared/db/test-support/test-db"
import { AuthorId } from "../domain/author-id"
import { DrizzleAuthorReader } from "./drizzle-author-reader"
import { authors } from "./schema"

describe("DrizzleAuthorReader", () => {
  describe("findById", () => {
    it("row の値をそのまま ReadModel として返す", () =>
      runInRollback(async (tx) => {
        const id = crypto.randomUUID()
        const name = "著者名"
        await tx.insert(authors).values({
          id,
          name,
          version: 2,
        })
        const reader = new DrizzleAuthorReader(tx)
        const found = await reader.findById(AuthorId.restore(id))
        expect(found).toEqual({
          id,
          name,
          version: 2,
        })
      }))

    it("存在しない場合は null を返す", () =>
      runInRollback(async (tx) => {
        const reader = new DrizzleAuthorReader(tx)
        const found = await reader.findById(AuthorId.generate())
        expect(found).toBeNull()
      }))
  })

  describe("findMany", () => {
    const seedRows = [
      { id: "01920000-0000-7000-8000-000000000002", name: "著者2", version: 0 },
      { id: "01920000-0000-7000-8000-000000000003", name: "著者3", version: 0 },
      { id: "01920000-0000-7000-8000-000000000001", name: "著者1", version: 0 },
    ]

    it("id 昇順の items と全件数の total を返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(authors).values(seedRows)
        const reader = new DrizzleAuthorReader(tx)
        const result = await reader.findMany({ limit: 10, offset: 0 })
        expect(result).toEqual({
          items: [
            {
              id: "01920000-0000-7000-8000-000000000001",
              name: "著者1",
              version: 0,
            },
            {
              id: "01920000-0000-7000-8000-000000000002",
              name: "著者2",
              version: 0,
            },
            {
              id: "01920000-0000-7000-8000-000000000003",
              name: "著者3",
              version: 0,
            },
          ],
          total: 3,
        })
      }))

    it("先頭から offset 件を skip して limit 件だけを返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(authors).values(seedRows)
        const reader = new DrizzleAuthorReader(tx)
        const result = await reader.findMany({ limit: 1, offset: 1 })
        expect(result).toEqual({
          items: [
            {
              id: "01920000-0000-7000-8000-000000000002",
              name: "著者2",
              version: 0,
            },
          ],
          total: 3,
        })
      }))

    it("offset が範囲外の場合は items は空で total は全件数を返す", () =>
      runInRollback(async (tx) => {
        await tx.insert(authors).values(seedRows)
        const reader = new DrizzleAuthorReader(tx)
        const result = await reader.findMany({ limit: 10, offset: 10 })
        expect(result).toEqual({ items: [], total: 3 })
      }))
  })
})
