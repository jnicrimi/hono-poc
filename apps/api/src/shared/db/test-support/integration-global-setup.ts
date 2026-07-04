import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import type { TestProject } from "vitest/node"

declare module "vitest" {
  interface ProvidedContext {
    testDatabaseUrl: string
  }
}

let container: StartedPostgreSqlContainer | undefined

export async function setup({ provide }: TestProject) {
  container = await new PostgreSqlContainer("postgres:18-alpine").start()

  const databaseUrl = container.getConnectionUri()
  const sql = postgres(databaseUrl, { max: 1, onnotice: () => {} })

  try {
    await migrate(drizzle(sql), { migrationsFolder: "drizzle" })
    provide("testDatabaseUrl", databaseUrl)
  } catch (error) {
    await container.stop()
    throw error
  } finally {
    await sql.end()
  }
}

export async function teardown() {
  await container?.stop()
}
