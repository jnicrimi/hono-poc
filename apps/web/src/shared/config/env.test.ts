import { describe, expect, it } from "vitest"
import { loadEnv } from "./env"

describe("loadEnv", () => {
  it("有効な VITE_API_URL を検証して返す", () => {
    expect(loadEnv({ VITE_API_URL: "http://localhost:3000" })).toEqual({
      VITE_API_URL: "http://localhost:3000",
    })
  })

  it("VITE_API_URL がない場合は例外を投げる", () => {
    expect(() => loadEnv({})).toThrow("Invalid environment variables")
  })

  it("VITE_API_URL が URL 形式でない場合は例外を投げる", () => {
    expect(() => loadEnv({ VITE_API_URL: "not-a-url" })).toThrow(
      "Invalid environment variables",
    )
  })
})
