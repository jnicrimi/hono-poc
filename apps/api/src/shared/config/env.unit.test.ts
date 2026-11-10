import { describe, expect, it } from "vitest"
import { loadEnv } from "./env"

const baseSource = {
  NODE_ENV: "development",
  PORT: "3000",
  LOG_LEVEL: "info",
  DATABASE_URL: "postgres://localhost:5432/app",
  CORS_ALLOWED_ORIGINS: "http://localhost:5173",
}

describe("loadEnv", () => {
  it("DB のタイムアウトは既定値の組み合わせで検証を通る", () => {
    const env = loadEnv(baseSource)

    expect(env).toMatchObject({
      DB_POOL_QUEUE_TIMEOUT_SEC: 5,
      DB_STATEMENT_TIMEOUT_MS: 15_000,
      DB_LOCK_TIMEOUT_MS: 5000,
      DB_TRANSACTION_TIMEOUT_MS: 20_000,
    })
  })

  it("接続待ちとトランザクションの合計が REQUEST_TIMEOUT_MS 以上ならエラーになる", () => {
    expect(() =>
      loadEnv({
        ...baseSource,
        REQUEST_TIMEOUT_MS: "25000",
      }),
    ).toThrow("DB_TRANSACTION_TIMEOUT_MS")
  })

  it("DB_STATEMENT_TIMEOUT_MS が DB_TRANSACTION_TIMEOUT_MS 以上ならエラーになる", () => {
    expect(() =>
      loadEnv({
        ...baseSource,
        DB_STATEMENT_TIMEOUT_MS: "20000",
      }),
    ).toThrow("DB_STATEMENT_TIMEOUT_MS")
  })

  it("DB_LOCK_TIMEOUT_MS が DB_STATEMENT_TIMEOUT_MS 以上ならエラーになる", () => {
    expect(() =>
      loadEnv({
        ...baseSource,
        DB_LOCK_TIMEOUT_MS: "15000",
      }),
    ).toThrow("DB_LOCK_TIMEOUT_MS")
  })
})
