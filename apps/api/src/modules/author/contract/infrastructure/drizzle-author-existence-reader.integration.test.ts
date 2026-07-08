import { describe, expect, it } from "vitest"
import { runInRollback } from "../../../../shared/db/test-support/test-db"
import { AuthorId } from "../../domain/author-id"
import { authors } from "../../infrastructure/schema"
import { DrizzleAuthorExistenceReader } from "./drizzle-author-existence-reader"

describe("DrizzleAuthorExistenceReader", () => {
  describe("findExistingIds", () => {
    it("存在する id のみを返す", () =>
      runInRollback(async (tx) => {
        const existing1 = crypto.randomUUID()
        const existing2 = crypto.randomUUID()
        const missing = crypto.randomUUID()
        await tx.insert(authors).values([
          { id: existing1, name: "著者名1" },
          { id: existing2, name: "著者名2" },
        ])
        const reader = new DrizzleAuthorExistenceReader(tx)
        const found = await reader.findExistingIds([
          AuthorId.restore(existing1),
          AuthorId.restore(existing2),
          AuthorId.restore(missing),
        ])
        expect(found.map((id) => id.value).sort()).toEqual(
          [existing1, existing2].sort(),
        )
      }))

    it("空配列の場合は空配列を返す", () =>
      runInRollback(async (tx) => {
        const reader = new DrizzleAuthorExistenceReader(tx)
        const found = await reader.findExistingIds([])
        expect(found).toEqual([])
      }))
  })
})
