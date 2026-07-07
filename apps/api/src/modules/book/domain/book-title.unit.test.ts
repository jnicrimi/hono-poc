import { describe, expect, it } from "vitest"
import { BOOK_TITLE_MAX_LENGTH, BookTitle } from "./book-title"
import { InvalidBookTitleError } from "./invalid-book-title-error"

describe("BookTitle", () => {
  describe("from", () => {
    it("入力した値のまま生成する", () => {
      const title = BookTitle.from("書籍 タイトル")
      expect(title.value).toBe("書籍 タイトル")
    })

    it("前後の空白を削除して生成する", () => {
      const title = BookTitle.from("  書籍 タイトル  ")
      expect(title.value).toBe("書籍 タイトル")
    })

    it("空文字の場合はエラーを投げる", () => {
      expect(() => BookTitle.from("")).toThrow(InvalidBookTitleError)
    })

    it("半角スペースのみの場合はエラーを投げる", () => {
      expect(() => BookTitle.from("  ")).toThrow(InvalidBookTitleError)
    })

    it("最大文字数ちょうどの場合は生成する", () => {
      const value = "a".repeat(BOOK_TITLE_MAX_LENGTH)
      expect(BookTitle.from(value).value).toBe(value)
    })

    it("最大文字数を超えた場合はエラーを投げる", () => {
      const value = "a".repeat(BOOK_TITLE_MAX_LENGTH + 1)
      expect(() => BookTitle.from(value)).toThrow(InvalidBookTitleError)
    })
  })
})
