import { sql } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { runInRollback } from "./test-support/test-db"

describe("DB 接続", () => {
  it("select 1 を実行して結果を取得できる", () =>
    runInRollback(async (tx) => {
      const rows = await tx.execute(sql`select 1 as one`)
      expect(rows[0]).toEqual({ one: 1 })
    }))
})
