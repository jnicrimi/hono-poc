import { describe, expect, it, vi } from "vitest"
import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { createAuthorReaderStub } from "../test-support/author-reader-stub"
import type { AuthorReadModel } from "./author-reader"
import { ListAuthors } from "./list-authors"

describe("ListAuthors", () => {
  it("page と perPage を limit と offset に変換して reader に渡す", async () => {
    const reader = createAuthorReaderStub()
    const useCase = new ListAuthors(reader)
    await useCase.execute({ page: 3, perPage: 10 })
    expect(reader.findMany).toHaveBeenCalledWith({ limit: 10, offset: 20 })
  })

  it("reader の items に pagination meta を付けて返す", async () => {
    const items: AuthorReadModel[] = [
      { id: VALID_UUID_V7, name: "著者名", version: 0 },
    ]
    const reader = createAuthorReaderStub({
      findMany: vi.fn().mockResolvedValue({ items, total: 25 }),
    })
    const useCase = new ListAuthors(reader)
    const result = await useCase.execute({ page: 3, perPage: 10 })
    expect(result).toEqual({
      items,
      pagination: { page: 3, perPage: 10, total: 25, totalPages: 3 },
    })
  })
})
