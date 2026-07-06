import { describe, expect, it } from "vitest"
import { toLimitOffset } from "./to-limit-offset"

describe("toLimitOffset", () => {
  it("limit は perPage、offset は (page - 1) × perPage になる", () => {
    const result = toLimitOffset({ page: 3, perPage: 10 })
    expect(result).toEqual({ limit: 10, offset: 20 })
  })

  it("page が 1 の場合は offset が 0 になる", () => {
    const result = toLimitOffset({ page: 1, perPage: 10 })
    expect(result).toEqual({ limit: 10, offset: 0 })
  })
})
