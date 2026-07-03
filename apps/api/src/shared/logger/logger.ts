import { type Logger, pino } from "pino"
import type { Env } from "../config/env"

export type AppLogger = Logger

export const createLogger = (
  env: Pick<Env, "NODE_ENV" | "LOG_LEVEL">,
): AppLogger =>
  pino({
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === "development"
      ? { transport: { target: "pino-pretty", options: { colorize: true } } }
      : {}),
  })
