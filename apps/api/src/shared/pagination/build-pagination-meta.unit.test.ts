import { describe, expect, it } from "vitest"
import { buildPaginationMeta } from "./build-pagination-meta"

describe("buildPaginationMeta", () => {
  it("割り切れる場合は total / perPage を totalPages とする", () => {
    const meta = buildPaginationMeta({ page: 1, perPage: 10, total: 100 })
    expect(meta).toEqual({ page: 1, perPage: 10, total: 100, totalPages: 10 })
  })

  it("端数がある場合は totalPages を切り上げる", () => {
    const meta = buildPaginationMeta({ page: 2, perPage: 5, total: 12 })
    expect(meta).toEqual({ page: 2, perPage: 5, total: 12, totalPages: 3 })
  })

  it("total が 0 の場合は totalPages も 0 になる", () => {
    const meta = buildPaginationMeta({ page: 1, perPage: 10, total: 0 })
    expect(meta).toEqual({ page: 1, perPage: 10, total: 0, totalPages: 0 })
  })
})
