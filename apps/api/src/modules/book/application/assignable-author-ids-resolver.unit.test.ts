import { describe, expect, it, vi } from "vitest"
import { createAuthorExistenceReaderStub } from "../../author/contract/test-support/author-existence-reader-stub"
import { AuthorId } from "../../author/domain/author-id"
import { AuthorsNotAssignableError } from "../domain/authors-not-assignable-error"
import { resolveAssignableAuthorIds } from "./assignable-author-ids-resolver"

describe("resolveAssignableAuthorIds", () => {
  it("全て存在する場合は AuthorId の配列を返す", async () => {
    const values = [AuthorId.generate().value, AuthorId.generate().value]
    const reader = createAuthorExistenceReaderStub()
    const resolved = await resolveAssignableAuthorIds(reader, values)
    expect(resolved.map((id) => id.value)).toEqual(values)
  })

  it("重複した id を除いた AuthorId の配列を返す", async () => {
    const value1 = AuthorId.generate().value
    const value2 = AuthorId.generate().value
    const reader = createAuthorExistenceReaderStub()
    const resolved = await resolveAssignableAuthorIds(reader, [
      value1,
      value1,
      value2,
    ])
    expect(resolved.map((id) => id.value)).toEqual([value1, value2])
  })

  it("存在しない id が含まれる場合は AuthorsNotAssignableError を投げる", async () => {
    const existing = AuthorId.generate()
    const missing = AuthorId.generate()
    const reader = createAuthorExistenceReaderStub({
      findExistingIds: vi.fn().mockResolvedValue([existing]),
    })
    await expect(
      resolveAssignableAuthorIds(reader, [existing.value, missing.value]),
    ).rejects.toThrow(AuthorsNotAssignableError)
  })
})
