import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { Book } from "./book"
import { BookId } from "./book-id"
import { BookTitle } from "./book-title"

describe("Book", () => {
  describe("create", () => {
    it("version 0 で生成する", () => {
      const book = Book.create({ title: BookTitle.from("書籍タイトル") })
      expect(uuidValidate(book.id.value)).toBe(true)
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.version).toBe(0)
    })
  })

  describe("reconstruct", () => {
    it("渡した値のまま復元する", () => {
      const id = BookId.generate()
      const book = Book.reconstruct({
        id,
        title: BookTitle.from("書籍タイトル"),
        version: 1,
      })
      expect(book.id.value).toBe(id.value)
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.version).toBe(1)
    })
  })

  describe("update", () => {
    it("タイトルだけ更新した新しいインスタンスを返す", () => {
      const id = BookId.generate()
      const book = Book.reconstruct({
        id,
        title: BookTitle.from("書籍タイトル"),
        version: 5,
      })
      const updated = book.update({
        title: BookTitle.from("更新後の書籍タイトル"),
      })
      expect(book.id.value).toBe(id.value)
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.version).toBe(5)
      expect(updated.id.value).toBe(id.value)
      expect(updated.title.value).toBe("更新後の書籍タイトル")
      expect(updated.version).toBe(5)
    })
  })
})
