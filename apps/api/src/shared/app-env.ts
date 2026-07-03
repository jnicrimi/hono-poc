import type { RequestIdVariables } from "hono/request-id"
import type { AppLogger } from "./logger/logger"

export type AppEnv = {
  Variables: RequestIdVariables & {
    logger: AppLogger
  }
}
