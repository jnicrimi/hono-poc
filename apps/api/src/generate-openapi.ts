import { writeFileSync } from "node:fs"
import { pino } from "pino"
import { createDb } from "./shared/db/client"
import { createApp, openApiDocConfig } from "./shared/di/container"
import type { AppLogger } from "./shared/logger/logger"

const db = createDb("postgres://placeholder@localhost:5432/placeholder", {
  max: 1,
  idleTimeoutSec: 1,
  connectTimeoutSec: 1,
  maxLifetimeSec: 1,
})
const logger: AppLogger = pino({ level: "silent" })

const app = createApp(db, logger, {
  enableApiDocs: false,
  cors: { allowedOrigins: [] },
  httpBoundary: { bodyLimitBytes: 1, requestTimeoutMs: 1 },
})

const document = app.getOpenAPIDocument(openApiDocConfig)
writeFileSync(
  new URL("../openapi.json", import.meta.url),
  `${JSON.stringify(document, null, 2)}\n`,
)
await db.$client.end()
