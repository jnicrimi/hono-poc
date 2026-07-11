import { validate as uuidValidate } from "uuid"
import { describe, expect, it, vi } from "vitest"
import { AuthorId } from "../../author/domain/author-id"
import type { BookId } from "../domain/book-id"
import { createBookReaderStub } from "../test-support/book-reader-stub"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { createBookUnitOfWorkStub } from "../test-support/book-unit-of-work-stub"
import { CreateBook } from "./create-book"

describe("CreateBook", () => {
  it("作成後の書籍の DTO を返し、authorIds を検証して一度だけ保存する", async () => {
    const authorId = AuthorId.generate().value
    const repository = createBookRepositoryStub()
    const reader = createBookReaderStub({
      findById: vi.fn().mockImplementation((id: BookId) =>
        Promise.resolve({
          id: id.value,
          title: "書籍タイトル",
          authors: [{ id: authorId, name: "著者名" }],
          version: 0,
        }),
      ),
    })
    const useCase = new CreateBook(
      createBookUnitOfWorkStub({ repository, reader }),
    )
    const result = await useCase.execute({
      title: "書籍タイトル",
      authorIds: [authorId],
    })
    expect(uuidValidate(result.id)).toBe(true)
    expect(result).toEqual({
      id: result.id,
      title: "書籍タイトル",
      authors: [{ id: authorId, name: "著者名" }],
      version: 0,
    })
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: result.id }),
        title: expect.objectContaining({ value: "書籍タイトル" }),
        authorIds: [expect.objectContaining({ value: authorId })],
      }),
    )
    expect(reader.findById).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: result.id }),
    )
  })

  it("作成後の書籍を取得できない場合はエラーを投げる", async () => {
    const authorId = AuthorId.generate().value
    const useCase = new CreateBook(createBookUnitOfWorkStub())
    await expect(
      useCase.execute({ title: "書籍タイトル", authorIds: [authorId] }),
    ).rejects.toThrow("作成後の書籍の取得に失敗しました")
  })
})
