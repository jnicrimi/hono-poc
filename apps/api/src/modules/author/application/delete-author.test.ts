import { describe, expect, it, vi } from "vitest"
import { Author } from "../domain/author"
import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { DeleteAuthor } from "./delete-author"

describe("DeleteAuthor", () => {
  it("存在する場合は削除する", async () => {
    const id = AuthorId.generate()
    const existing = Author.reconstruct({
      id,
      name: AuthorName.from("著者名"),
      version: 1,
    })
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
    })
    const useCase = new DeleteAuthor(repository)
    await useCase.execute({ id: id.value })
    expect(repository.delete).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: id.value }),
    )
  })

  it("存在しない場合は AuthorNotFoundError を投げる", async () => {
    const repository = createAuthorRepositoryStub()
    const useCase = new DeleteAuthor(repository)
    await expect(
      useCase.execute({ id: AuthorId.generate().value }),
    ).rejects.toThrow(AuthorNotFoundError)
    expect(repository.delete).not.toHaveBeenCalled()
  })
})
