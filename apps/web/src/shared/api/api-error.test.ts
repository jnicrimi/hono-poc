import { describe, expect, it } from "vitest"
import { ApiError } from "./api-error"

describe("ApiError", () => {
  it("status と errors を保持する", () => {
    const error = new ApiError(404, [{ message: "見つかりません" }])
    expect(error.status).toBe(404)
    expect(error.errors).toEqual([{ message: "見つかりません" }])
    expect(error.name).toBe("ApiError")
  })

  it("cause を連鎖する", () => {
    const cause = new Error("fetch failed")
    const error = new ApiError(0, [{ message: "エラー" }], { cause })
    expect(error.cause).toBe(cause)
  })
})
