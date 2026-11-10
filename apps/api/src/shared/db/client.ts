import type { PgDatabase } from "drizzle-orm/pg-core"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export type DBConfig = {
  readonly max: number
  readonly idleTimeoutSec: number
  readonly connectTimeoutSec: number
  readonly maxLifetimeSec: number
  readonly queueTimeoutSec: number
  readonly statementTimeoutMs: number
  readonly lockTimeoutMs: number
  readonly transactionTimeoutMs: number
}

export const createDb = (databaseUrl: string, config: DBConfig) => {
  const sql = postgres(databaseUrl, {
    max: config.max,
    idle_timeout: config.idleTimeoutSec,
    connect_timeout: config.connectTimeoutSec,
    max_lifetime: config.maxLifetimeSec,
    queue_timeout: config.queueTimeoutSec,
    connection: {
      statement_timeout: config.statementTimeoutMs,
      lock_timeout: config.lockTimeoutMs,
      transaction_timeout: config.transactionTimeoutMs,
    },
  })
  return drizzle(sql)
}

export type Db = PgDatabase<PostgresJsQueryResultHKT>
