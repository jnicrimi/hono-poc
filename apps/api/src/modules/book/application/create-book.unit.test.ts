import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { createAuthorExistenceReaderStub } from "../../author/contract/test-support/author-existence-reader-stub"
import { AuthorId } from "../../author/domain/author-id"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { CreateBook } from "./create-book"

describe("CreateBook", () => {
  it("採番した ID を返し、authorIds を検証して一度だけ保存する", async () => {
    const authorId = AuthorId.generate().value
    const repository = createBookRepositoryStub()
    const useCase = new CreateBook(
      repository,
      createAuthorExistenceReaderStub(),
    )
    const result = await useCase.execute({
      title: "書籍タイトル",
      authorIds: [authorId],
    })
    expect(uuidValidate(result.id)).toBe(true)
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: result.id }),
        title: expect.objectContaining({ value: "書籍タイトル" }),
        authorIds: [expect.objectContaining({ value: authorId })],
      }),
    )
  })
})
