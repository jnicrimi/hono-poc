import { describe, expect, it, vi } from "vitest"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import { BookTitle } from "../domain/book-title"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { UpdateBook } from "./update-book"

describe("UpdateBook", () => {
  it("更新後の DTO を返し、一度だけ更新する", async () => {
    const id = BookId.generate()
    const existing = Book.reconstruct({
      id,
      title: BookTitle.from("書籍タイトル"),
      version: 1,
    })
    const saved = Book.reconstruct({
      id,
      title: BookTitle.from("更新後の書籍タイトル"),
      version: 2,
    })
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(existing),
      update: vi.fn().mockResolvedValue(saved),
    })
    const useCase = new UpdateBook(repository)
    const result = await useCase.execute({
      id: id.value,
      title: "更新後の書籍タイトル",
      version: 1,
    })
    expect(result).toEqual({
      id: id.value,
      title: "更新後の書籍タイトル",
      version: 2,
    })
    expect(repository.update).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: id.value }),
        title: expect.objectContaining({ value: "更新後の書籍タイトル" }),
      }),
      1,
    )
  })

  it("存在しない場合は BookNotFoundError を投げる", async () => {
    const repository = createBookRepositoryStub()
    const useCase = new UpdateBook(repository)
    await expect(
      useCase.execute({
        id: BookId.generate().value,
        title: "更新後の書籍タイトル",
        version: 1,
      }),
    ).rejects.toThrow(BookNotFoundError)
    expect(repository.update).not.toHaveBeenCalled()
  })
})
