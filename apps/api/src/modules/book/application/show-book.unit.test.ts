import { describe, expect, it, vi } from "vitest"
import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { BookNotFoundError } from "../domain/book-not-found-error"
import { createBookReaderStub } from "../test-support/book-reader-stub"
import type { BookReadModel } from "./book-reader"
import { ShowBook } from "./show-book"

describe("ShowBook", () => {
  it("存在する場合は ReadModel を返す", async () => {
    const readModel: BookReadModel = {
      id: VALID_UUID_V7,
      title: "書籍タイトル",
      authors: [],
      version: 0,
    }
    const reader = createBookReaderStub({
      findById: vi.fn().mockResolvedValue(readModel),
    })
    const useCase = new ShowBook(reader)
    const result = await useCase.execute({ id: readModel.id })
    expect(result).toEqual(readModel)
    expect(reader.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: readModel.id }),
    )
  })

  it("存在しない場合は BookNotFoundError を投げる", async () => {
    const reader = createBookReaderStub()
    const useCase = new ShowBook(reader)
    await expect(useCase.execute({ id: VALID_UUID_V7 })).rejects.toThrow(
      BookNotFoundError,
    )
  })
})
