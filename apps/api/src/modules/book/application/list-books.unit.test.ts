import { describe, expect, it, vi } from "vitest"
import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { createBookReaderStub } from "../test-support/book-reader-stub"
import type { BookReadModel } from "./book-reader"
import { ListBooks } from "./list-books"

describe("ListBooks", () => {
  it("page と perPage を limit と offset に変換して reader に渡す", async () => {
    const reader = createBookReaderStub()
    const useCase = new ListBooks(reader)
    await useCase.execute({ page: 3, perPage: 10 })
    expect(reader.findMany).toHaveBeenCalledWith({ limit: 10, offset: 20 })
  })

  it("reader の items に pagination meta を付けて返す", async () => {
    const items: BookReadModel[] = [
      { id: VALID_UUID_V7, title: "書籍タイトル", authors: [], version: 0 },
    ]
    const reader = createBookReaderStub({
      findMany: vi.fn().mockResolvedValue({ items, total: 25 }),
    })
    const useCase = new ListBooks(reader)
    const result = await useCase.execute({ page: 3, perPage: 10 })
    expect(result).toEqual({
      items,
      pagination: { page: 3, perPage: 10, total: 25, totalPages: 3 },
    })
  })
})
