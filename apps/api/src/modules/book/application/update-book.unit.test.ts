import { describe, expect, it, vi } from "vitest"
import { AuthorId } from "../../author/domain/author-id"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import { BookTitle } from "../domain/book-title"
import { createBookReaderStub } from "../test-support/book-reader-stub"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { createBookUnitOfWorkStub } from "../test-support/book-unit-of-work-stub"
import { UpdateBook } from "./update-book"

describe("UpdateBook", () => {
  it("更新後の書籍の DTO を返し、一度だけ更新する", async () => {
    const id = BookId.generate()
    const authorId = AuthorId.generate()
    const nextAuthorId = AuthorId.generate()
    const existing = Book.reconstruct({
      id,
      title: BookTitle.from("書籍タイトル"),
      authorIds: [authorId],
      version: 1,
    })
    const saved = Book.reconstruct({
      id,
      title: BookTitle.from("更新後の書籍タイトル"),
      authorIds: [nextAuthorId],
      version: 2,
    })
    const updatedBook = {
      id: id.value,
      title: "更新後の書籍タイトル",
      authors: [{ id: nextAuthorId.value, name: "著者名" }],
      version: 2,
    }
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(saved),
    })
    const reader = createBookReaderStub({
      findById: vi.fn().mockResolvedValue(updatedBook),
    })
    const useCase = new UpdateBook(
      createBookUnitOfWorkStub({ repository, reader }),
    )
    const result = await useCase.execute({
      id: id.value,
      title: "更新後の書籍タイトル",
      authorIds: [nextAuthorId.value],
      version: 1,
    })
    expect(result).toEqual(updatedBook)
    expect(repository.update).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: id.value }),
        title: expect.objectContaining({ value: "更新後の書籍タイトル" }),
        authorIds: [expect.objectContaining({ value: nextAuthorId.value })],
      }),
      1,
    )
    expect(reader.findById).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: id.value }),
    )
  })

  it("更新後の書籍を取得できない場合はエラーを投げる", async () => {
    const id = BookId.generate()
    const authorId = AuthorId.generate()
    const existing = Book.reconstruct({
      id,
      title: BookTitle.from("書籍タイトル"),
      authorIds: [authorId],
      version: 1,
    })
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(existing),
    })
    const useCase = new UpdateBook(createBookUnitOfWorkStub({ repository }))
    await expect(
      useCase.execute({
        id: id.value,
        title: "更新後の書籍タイトル",
        authorIds: [authorId.value],
        version: 1,
      }),
    ).rejects.toThrow("更新後の書籍の取得に失敗しました")
  })

  it("存在しない場合は BookNotFoundError を投げる", async () => {
    const repository = createBookRepositoryStub()
    const useCase = new UpdateBook(createBookUnitOfWorkStub({ repository }))
    await expect(
      useCase.execute({
        id: BookId.generate().value,
        title: "更新後の書籍タイトル",
        authorIds: [AuthorId.generate().value],
        version: 1,
      }),
    ).rejects.toThrow(BookNotFoundError)
    expect(repository.update).not.toHaveBeenCalled()
  })
})
