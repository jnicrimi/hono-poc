import type { Hono } from "hono"
import { cors } from "hono/cors"
import type { AppEnv } from "../app-env"

export type CorsConfig = {
  readonly allowedOrigins: readonly string[]
}

export const registerCors = (app: Hono<AppEnv>, config: CorsConfig) => {
  app.use(
    cors({
      origin: [...config.allowedOrigins],
      credentials: true,
    }),
  )
}
