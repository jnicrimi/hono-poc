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
})
