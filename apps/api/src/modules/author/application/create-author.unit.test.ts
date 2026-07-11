import { validate as uuidValidate } from "uuid"
import { describe, expect, it, vi } from "vitest"
import type { AuthorId } from "../domain/author-id"
import { createAuthorReaderStub } from "../test-support/author-reader-stub"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { CreateAuthor } from "./create-author"

describe("CreateAuthor", () => {
  it("作成後の著者の DTO を返し、一度だけ保存する", async () => {
    const repository = createAuthorRepositoryStub()
    const reader = createAuthorReaderStub({
      findById: vi
        .fn()
        .mockImplementation((id: AuthorId) =>
          Promise.resolve({ id: id.value, name: "著者名", version: 0 }),
        ),
    })
    const useCase = new CreateAuthor(repository, reader)
    const result = await useCase.execute({ name: "著者名" })
    expect(uuidValidate(result.id)).toBe(true)
    expect(result).toEqual({ id: result.id, name: "著者名", version: 0 })
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: result.id }),
        name: expect.objectContaining({ value: "著者名" }),
      }),
    )
    expect(reader.findById).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: result.id }),
    )
  })

  it("作成後の著者を取得できない場合はエラーを投げる", async () => {
    const repository = createAuthorRepositoryStub()
    const useCase = new CreateAuthor(repository, createAuthorReaderStub())
    await expect(useCase.execute({ name: "著者名" })).rejects.toThrow(
      "作成後の著者の取得に失敗しました",
    )
  })
})
