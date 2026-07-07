import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { CreateBook } from "./create-book"

describe("CreateBook", () => {
  it("採番した ID を返し、一度だけ保存する", async () => {
    const repository = createBookRepositoryStub()
    const useCase = new CreateBook(repository)
    const result = await useCase.execute({ title: "書籍タイトル" })
    expect(uuidValidate(result.id)).toBe(true)
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: result.id }),
        title: expect.objectContaining({ value: "書籍タイトル" }),
      }),
    )
  })
})
