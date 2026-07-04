import type { PgDatabase } from "drizzle-orm/pg-core"
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

export type DBPoolConfig = {
  readonly max: number
  readonly idleTimeoutSec: number
  readonly connectTimeoutSec: number
  readonly maxLifetimeSec: number
}

export const createDb = (databaseUrl: string, poolConfig: DBPoolConfig) => {
  const sql = postgres(databaseUrl, {
    max: poolConfig.max,
    idle_timeout: poolConfig.idleTimeoutSec,
    connect_timeout: poolConfig.connectTimeoutSec,
    max_lifetime: poolConfig.maxLifetimeSec,
  })
  return drizzle(sql)
}

export type Db = PgDatabase<PostgresJsQueryResultHKT>
