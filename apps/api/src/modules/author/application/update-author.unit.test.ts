import { describe, expect, it, vi } from "vitest"
import { Author } from "../domain/author"
import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import { createAuthorReaderStub } from "../test-support/author-reader-stub"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { UpdateAuthor } from "./update-author"

describe("UpdateAuthor", () => {
  it("更新後の著者の DTO を返し、一度だけ更新する", async () => {
    const id = AuthorId.generate()
    const existing = Author.reconstruct({
      id,
      name: AuthorName.from("著者名"),
      version: 1,
    })
    const saved = Author.reconstruct({
      id,
      name: AuthorName.from("更新後の著者名"),
      version: 2,
    })
    const updatedAuthor = {
      id: id.value,
      name: "更新後の著者名",
      version: 2,
    }
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(saved),
    })
    const reader = createAuthorReaderStub({
      findById: vi.fn().mockResolvedValue(updatedAuthor),
    })
    const useCase = new UpdateAuthor(repository, reader)
    const result = await useCase.execute({
      id: id.value,
      name: "更新後の著者名",
      version: 1,
    })
    expect(result).toEqual(updatedAuthor)
    expect(repository.update).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: id.value }),
        name: expect.objectContaining({ value: "更新後の著者名" }),
      }),
      1,
    )
    expect(reader.findById).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: id.value }),
    )
  })

  it("更新後の著者を取得できない場合はエラーを投げる", async () => {
    const id = AuthorId.generate()
    const existing = Author.reconstruct({
      id,
      name: AuthorName.from("著者名"),
      version: 1,
    })
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(existing),
    })
    const useCase = new UpdateAuthor(repository, createAuthorReaderStub())
    await expect(
      useCase.execute({
        id: id.value,
        name: "更新後の著者名",
        version: 1,
      }),
    ).rejects.toThrow("更新後の著者の取得に失敗しました")
  })

  it("存在しない場合は AuthorNotFoundError を投げる", async () => {
    const repository = createAuthorRepositoryStub()
    const useCase = new UpdateAuthor(repository, createAuthorReaderStub())
    await expect(
      useCase.execute({
        id: AuthorId.generate().value,
        name: "更新後の著者名",
        version: 1,
      }),
    ).rejects.toThrow(AuthorNotFoundError)
    expect(repository.update).not.toHaveBeenCalled()
  })
})
