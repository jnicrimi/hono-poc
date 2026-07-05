import { describe, expect, it, vi } from "vitest"
import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import { createAuthorReaderStub } from "../test-support/author-reader-stub"
import type { AuthorReadModel } from "./author-reader"
import { GetAuthorById } from "./get-author-by-id"

describe("GetAuthorById", () => {
  it("存在する場合は ReadModel を返す", async () => {
    const readModel: AuthorReadModel = {
      id: VALID_UUID_V7,
      name: "著者名",
      version: 0,
    }
    const reader = createAuthorReaderStub({
      findById: vi.fn().mockResolvedValue(readModel),
    })
    const useCase = new GetAuthorById(reader)
    const result = await useCase.execute({ id: readModel.id })
    expect(result).toEqual(readModel)
    expect(reader.findById).toHaveBeenCalledWith(
      expect.objectContaining({ value: readModel.id }),
    )
  })

  it("存在しない場合は AuthorNotFoundError を投げる", async () => {
    const reader = createAuthorReaderStub()
    const useCase = new GetAuthorById(reader)
    await expect(useCase.execute({ id: VALID_UUID_V7 })).rejects.toThrow(
      AuthorNotFoundError,
    )
  })
})
