import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { describe, expect, inject, it } from "vitest"
import { runInRollback } from "../db/test-support/test-db"
import { isDbUnavailableError } from "./db-unavailable-error"

describe("isDbUnavailableError", () => {
  it("statement_timeout を超えたクエリのエラーを判定できる", () =>
    runInRollback(async (tx) => {
      await tx.execute(sql`SET LOCAL statement_timeout = 1`)

      const error = await tx
        .execute(sql`SELECT pg_sleep(1)`)
        .catch((e: unknown) => e)

      expect((error as Error).cause).toMatchObject({ code: "57014" })
      expect(isDbUnavailableError(error)).toBe(true)
    }))

  it("transaction_timeout を超えたトランザクションのエラーを判定できる", async () => {
    // transaction_timeout は接続を切断するため、共有の接続とは別に作る
    const client = postgres(inject("testDatabaseUrl"), {
      max: 1,
      connection: { transaction_timeout: 100 },
    })
    try {
      const error = await drizzle(client)
        .transaction(async (tx) => {
          await tx.execute(sql`SELECT pg_sleep(1)`)
        })
        .catch((e: unknown) => e)

      expect(error).toMatchObject({ code: "25P04" })
      expect(isDbUnavailableError(error)).toBe(true)
    } finally {
      await client.end()
    }
  })
})
