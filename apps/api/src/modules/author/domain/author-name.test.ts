import { describe, expect, it } from "vitest"
import { AUTHOR_NAME_MAX_LENGTH, AuthorName } from "./author-name"
import { InvalidAuthorNameError } from "./invalid-author-name-error"

describe("AuthorName", () => {
  describe("from", () => {
    it("入力した値のまま生成する", () => {
      const name = AuthorName.from("姓 名")
      expect(name.value).toBe("姓 名")
    })

    it("前後の空白を削除して生成する", () => {
      const name = AuthorName.from("  姓 名  ")
      expect(name.value).toBe("姓 名")
    })

    it("空文字の場合はエラーを投げる", () => {
      expect(() => AuthorName.from("")).toThrow(InvalidAuthorNameError)
    })

    it("半角スペースのみの場合はエラーを投げる", () => {
      expect(() => AuthorName.from("  ")).toThrow(InvalidAuthorNameError)
    })

    it("最大文字数ちょうどの場合は生成する", () => {
      const value = "a".repeat(AUTHOR_NAME_MAX_LENGTH)
      expect(AuthorName.from(value).value).toBe(value)
    })

    it("最大文字数を超えた場合はエラーを投げる", () => {
      const value = "a".repeat(AUTHOR_NAME_MAX_LENGTH + 1)
      expect(() => AuthorName.from(value)).toThrow(InvalidAuthorNameError)
    })
  })
})
