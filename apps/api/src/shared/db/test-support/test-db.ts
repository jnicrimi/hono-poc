import { TransactionRollbackError } from "drizzle-orm"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { inject } from "vitest"
import type { Db } from "../client"

const createTestDb = () => {
  const sql = postgres(inject("testDatabaseUrl"))
  return { db: drizzle(sql), close: () => sql.end() }
}

let cached: ReturnType<typeof createTestDb> | null = null

const getTestDb = () => {
  if (!cached) {
    cached = createTestDb()
  }
  return cached.db
}

export const closeTestDb = async () => {
  if (cached) {
    await cached.close()
    cached = null
  }
}

export const runInRollback = async (
  fn: (tx: Db) => Promise<void>,
): Promise<void> => {
  try {
    await getTestDb().transaction(async (tx) => {
      await fn(tx)
      tx.rollback()
    })
  } catch (error) {
    if (error instanceof TransactionRollbackError) {
      return
    }
    throw error
  }
}
