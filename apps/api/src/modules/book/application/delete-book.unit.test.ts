import { describe, expect, it, vi } from "vitest"
import { AuthorId } from "../../author/domain/author-id"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import { BookTitle } from "../domain/book-title"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { DeleteBook } from "./delete-book"

describe("DeleteBook", () => {
  it("存在する場合は削除する", async () => {
    const id = BookId.generate()
    const existing = Book.reconstruct({
      id,
      title: BookTitle.from("書籍タイトル"),
      authorIds: [AuthorId.generate()],
      version: 1,
    })
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
    })
    const useCase = new DeleteBook(repository)
    await useCase.execute({ id: id.value })
    expect(repository.delete).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: id.value }),
    )
  })

  it("存在しない場合は BookNotFoundError を投げる", async () => {
    const repository = createBookRepositoryStub()
    const useCase = new DeleteBook(repository)
    await expect(
      useCase.execute({ id: BookId.generate().value }),
    ).rejects.toThrow(BookNotFoundError)
    expect(repository.delete).not.toHaveBeenCalled()
  })
})
