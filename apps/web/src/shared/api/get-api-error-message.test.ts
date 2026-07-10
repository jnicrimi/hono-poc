import { describe, expect, it } from "vitest"
import { ApiError } from "./api-error"
import { getApiErrorMessage } from "./get-api-error-message"

describe("getApiErrorMessage", () => {
  it("ApiError の場合は先頭のエラーメッセージを返す", () => {
    const error = new ApiError(409, [
      { message: "エラー-1" },
      { message: "エラー-2" },
    ])

    expect(getApiErrorMessage(error)).toBe("エラー-1")
  })

  it("ApiError 以外の場合は undefined を返す", () => {
    expect(getApiErrorMessage(new Error("エラー-1"))).toBeUndefined()
  })
})
