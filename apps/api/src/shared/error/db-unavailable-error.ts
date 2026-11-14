// QUEUE_TIMEOUT: postgres.js が空き接続を待ちきれなかったときのコード
// CONNECTION_CLOSED: postgres.js が接続の切断を検知したときのコード
// 57014: statement_timeout 超過（SQLSTATE query_canceled）
// 55P03: lock_timeout 超過（SQLSTATE lock_not_available）
// 25P04: transaction_timeout 超過（SQLSTATE transaction_timeout）
const DB_UNAVAILABLE_CODES: ReadonlySet<unknown> = new Set([
  "QUEUE_TIMEOUT",
  "CONNECTION_CLOSED",
  "57014",
  "55P03",
  "25P04",
])

const hasUnavailableCode = (value: unknown): boolean =>
  typeof value === "object" &&
  value !== null &&
  "code" in value &&
  DB_UNAVAILABLE_CODES.has(value.code)

// Drizzle はクエリのエラーを DrizzleQueryError で包んで cause に入れるが、
// トランザクション開始時の待機タイムアウトは包まずに投げるため両方を見る
export const isDbUnavailableError = (err: unknown): boolean =>
  hasUnavailableCode(err) ||
  (err instanceof Error && hasUnavailableCode(err.cause))
