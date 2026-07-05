import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { CreateAuthor } from "./create-author"

describe("CreateAuthor", () => {
  it("採番した ID を返し、一度だけ保存する", async () => {
    const repository = createAuthorRepositoryStub()
    const useCase = new CreateAuthor(repository)
    const result = await useCase.execute({ name: "著者名" })
    expect(uuidValidate(result.id)).toBe(true)
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: result.id }),
        name: expect.objectContaining({ value: "著者名" }),
      }),
    )
  })
})
