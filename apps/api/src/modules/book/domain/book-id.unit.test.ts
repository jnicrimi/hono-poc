import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { UPPERCASE_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { BookId } from "./book-id"
import { InvalidBookIdError } from "./invalid-book-id-error"

describe("BookId", () => {
  describe("generate", () => {
    it("UUID 形式の値を生成する", () => {
      const id = BookId.generate()
      expect(uuidValidate(id.value)).toBe(true)
    })
  })

  describe("restore", () => {
    it("有効な値の場合は復元する", () => {
      const value = BookId.generate().value
      expect(BookId.restore(value).value).toBe(value)
    })

    it("不正な値の場合はエラーを投げる", () => {
      expect(() => BookId.restore("invalid-uuid")).toThrow(InvalidBookIdError)
    })

    it("大文字を含む場合はエラーを投げる", () => {
      expect(() => BookId.restore(UPPERCASE_UUID_V7)).toThrow(
        InvalidBookIdError,
      )
    })
  })
})
