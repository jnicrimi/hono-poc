import { describe, expect, it } from "vitest"
import { ApiError } from "@/shared/api/api-error"
import { shouldRetryQuery } from "./query-client"

describe("shouldRetryQuery", () => {
  it("5xx は 1 回だけ再試行する", () => {
    const error = new ApiError(500, [{ message: "サーバーエラー" }])
    expect(shouldRetryQuery(0, error)).toBe(true)
    expect(shouldRetryQuery(1, error)).toBe(false)
  })

  it("ネットワークエラーは再試行する", () => {
    const error = new ApiError(0, [{ message: "ネットワークエラー" }])
    expect(shouldRetryQuery(0, error)).toBe(true)
  })

  it("4xx は再試行しない", () => {
    const error = new ApiError(404, [{ message: "見つかりません" }])
    expect(shouldRetryQuery(0, error)).toBe(false)
  })

  it("ApiError 以外は再試行しない", () => {
    expect(shouldRetryQuery(0, new Error("boom"))).toBe(false)
  })
})
