import { type SQL, sql } from "drizzle-orm"
import type { Hono } from "hono"
import type { AppEnv } from "../app-env"
import type { AppLogger } from "../logger/logger"

type PingableDb = {
  execute(query: SQL): Promise<unknown>
}

export const registerHealthCheck = (
  app: Hono<AppEnv>,
  db: PingableDb,
  logger: AppLogger,
) => {
  app.get("/health", (c) => c.json({ status: "ok" }, 200))

  app.get("/health/ready", async (c) => {
    try {
      await db.execute(sql`select 1`)
      return c.json({ status: "ok" }, 200)
    } catch (error) {
      logger.error({ err: error }, "readiness check failed")
      return c.json({ status: "error" }, 503)
    }
  })
}
