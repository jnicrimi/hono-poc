import { sql } from "drizzle-orm"
import { describe, expect, it } from "vitest"
import { runInRollback } from "../db/test-support/test-db"
import { isDbTimeoutError } from "./db-timeout-error"

describe("isDbTimeoutError", () => {
  it("statement_timeout を超えたクエリのエラーを判定できる", () =>
    runInRollback(async (tx) => {
      await tx.execute(sql`SET LOCAL statement_timeout = 1`)

      const error = await tx
        .execute(sql`SELECT pg_sleep(1)`)
        .catch((e: unknown) => e)

      expect((error as Error).cause).toMatchObject({ code: "57014" })
      expect(isDbTimeoutError(error)).toBe(true)
    }))
})
