// QUEUE_TIMEOUT: postgres.js が空き接続を待ちきれなかったときのコード
// 57014: statement_timeout 超過（SQLSTATE query_canceled）
// 55P03: lock_timeout 超過（SQLSTATE lock_not_available）
const DB_TIMEOUT_CODES: ReadonlySet<unknown> = new Set([
  "QUEUE_TIMEOUT",
  "57014",
  "55P03",
])

const hasTimeoutCode = (value: unknown): boolean =>
  typeof value === "object" &&
  value !== null &&
  "code" in value &&
  DB_TIMEOUT_CODES.has(value.code)

// Drizzle はクエリのエラーを DrizzleQueryError で包んで cause に入れるが、
// トランザクション開始時の待機タイムアウトは包まずに投げるため両方を見る
export const isDbTimeoutError = (err: unknown): boolean =>
  hasTimeoutCode(err) || (err instanceof Error && hasTimeoutCode(err.cause))
