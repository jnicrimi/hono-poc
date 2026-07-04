import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { AuthorId } from "./author-id"
import { InvalidAuthorIdError } from "./invalid-author-id-error"

describe("AuthorId", () => {
  describe("generate", () => {
    it("UUID 形式の値を生成する", () => {
      const id = AuthorId.generate()
      expect(uuidValidate(id.value)).toBe(true)
    })
  })

  describe("restore", () => {
    it("有効な値の場合は復元する", () => {
      const value = AuthorId.generate().value
      expect(AuthorId.restore(value).value).toBe(value)
    })

    it("不正な値の場合はエラーを投げる", () => {
      expect(() => AuthorId.restore("invalid-uuid")).toThrow(
        InvalidAuthorIdError,
      )
    })
  })
})
