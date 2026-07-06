import type { ServerType } from "@hono/node-server"
import type { AppLogger } from "../logger/logger"

type SignalRegistrar = {
  readonly on: (signal: NodeJS.Signals, listener: () => void) => void
}

type ClosableDb = {
  readonly $client: { readonly end: () => Promise<unknown> }
}

export type GracefulShutdownOptions = {
  readonly server: ServerType
  readonly db: ClosableDb
  readonly logger: AppLogger
  readonly timeoutMs: number
  readonly onExit?: (code: number) => void
  readonly processRef?: SignalRegistrar
}

export const registerGracefulShutdown = ({
  server,
  db,
  logger,
  timeoutMs,
  onExit = (code) => process.exit(code),
  processRef = process,
}: GracefulShutdownOptions): void => {
  let shuttingDown = false

  const shutdown = (signal: NodeJS.Signals) => {
    if (shuttingDown) return
    shuttingDown = true
    logger.info({ signal }, "shutdown initiated")

    let exited = false
    const forceTimer = setTimeout(() => {
      logger.error({ timeoutMs }, "shutdown timed out, forcing exit")
      exitOnce(1)
    }, timeoutMs)

    const exitOnce = (code: number) => {
      if (exited) return
      exited = true
      clearTimeout(forceTimer)
      onExit(code)
    }

    server.close(async (err) => {
      if (err) {
        logger.error({ err }, "server close failed")
      }
      try {
        await db.$client.end()
      } catch (dbErr) {
        logger.error({ err: dbErr }, "db close failed")
      }
      logger.info("shutdown complete")
      exitOnce(err ? 1 : 0)
    })

    if ("closeIdleConnections" in server) {
      server.closeIdleConnections()
    }
  }

  processRef.on("SIGINT", () => shutdown("SIGINT"))
  processRef.on("SIGTERM", () => shutdown("SIGTERM"))
}
