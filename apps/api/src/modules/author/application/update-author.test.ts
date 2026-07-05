import { describe, expect, it, vi } from "vitest"
import { Author } from "../domain/author"
import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { UpdateAuthor } from "./update-author"

describe("UpdateAuthor", () => {
  it("更新後の DTO を返し、一度だけ更新する", async () => {
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
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(saved),
    })
    const useCase = new UpdateAuthor(repository)
    const result = await useCase.execute({
      id: id.value,
      name: "更新後の著者名",
      version: 1,
    })
    expect(result).toEqual({
      id: id.value,
      name: "更新後の著者名",
      version: 2,
    })
    expect(repository.update).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: id.value }),
        name: expect.objectContaining({ value: "更新後の著者名" }),
      }),
      1,
    )
  })

  it("存在しない場合は AuthorNotFoundError を投げる", async () => {
    const repository = createAuthorRepositoryStub()
    const useCase = new UpdateAuthor(repository)
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
