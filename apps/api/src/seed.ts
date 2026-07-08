import { loadEnv } from "./shared/config/env"
import { createDb } from "./shared/db/client"
import { seedDatabase } from "./shared/di/seeder"
import { createLogger } from "./shared/logger/logger"

const env = loadEnv()
// 本番 DB への誤実行を防御する
if (env.NODE_ENV !== "development") {
  throw new Error("Database seeding is allowed only in development")
}

const logger = createLogger(env)
const db = createDb(env.DATABASE_URL, {
  max: env.DB_POOL_MAX,
  idleTimeoutSec: env.DB_POOL_IDLE_TIMEOUT_SEC,
  connectTimeoutSec: env.DB_POOL_CONNECT_TIMEOUT_SEC,
  maxLifetimeSec: env.DB_POOL_MAX_LIFETIME_SEC,
})

try {
  const result = await seedDatabase(db)
  logger.info(result, "seed completed")
} catch (error) {
  logger.error({ err: error }, "seed failed")
  process.exitCode = 1
} finally {
  await db.$client.end()
}
