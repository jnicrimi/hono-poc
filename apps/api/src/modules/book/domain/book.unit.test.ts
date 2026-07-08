import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { AuthorId } from "../../author/domain/author-id"
import { BOOK_MAX_AUTHOR_IDS, Book } from "./book"
import { BookId } from "./book-id"
import { BookTitle } from "./book-title"
import { InvalidBookAuthorsError } from "./invalid-book-authors-error"

const buildAuthorIds = (count: number): readonly AuthorId[] =>
  Array.from({ length: count }, () => AuthorId.generate())

describe("Book", () => {
  describe("create", () => {
    it("version 0 で生成する", () => {
      const authorIds = buildAuthorIds(2)
      const book = Book.create({
        title: BookTitle.from("書籍タイトル"),
        authorIds,
      })
      expect(uuidValidate(book.id.value)).toBe(true)
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.authorIds).toEqual(authorIds)
      expect(book.version).toBe(0)
    })

    it("authorIds が空の場合はエラーを投げる", () => {
      expect(() =>
        Book.create({ title: BookTitle.from("書籍タイトル"), authorIds: [] }),
      ).toThrow(InvalidBookAuthorsError)
    })

    it("authorIds が上限を超えた場合はエラーを投げる", () => {
      expect(() =>
        Book.create({
          title: BookTitle.from("書籍タイトル"),
          authorIds: buildAuthorIds(BOOK_MAX_AUTHOR_IDS + 1),
        }),
      ).toThrow(InvalidBookAuthorsError)
    })

    it("authorIds が上限ちょうどの場合は生成する", () => {
      const book = Book.create({
        title: BookTitle.from("書籍タイトル"),
        authorIds: buildAuthorIds(BOOK_MAX_AUTHOR_IDS),
      })
      expect(book.authorIds).toHaveLength(BOOK_MAX_AUTHOR_IDS)
    })
  })

  describe("reconstruct", () => {
    it("渡した値のまま復元する", () => {
      const id = BookId.generate()
      const authorIds = buildAuthorIds(1)
      const book = Book.reconstruct({
        id,
        title: BookTitle.from("書籍タイトル"),
        authorIds,
        version: 1,
      })
      expect(book.id.value).toBe(id.value)
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.authorIds).toEqual(authorIds)
      expect(book.version).toBe(1)
    })
  })

  describe("update", () => {
    it("タイトルと authorIds を更新した新しいインスタンスを返す", () => {
      const id = BookId.generate()
      const authorIds = buildAuthorIds(1)
      const nextAuthorIds = buildAuthorIds(2)
      const book = Book.reconstruct({
        id,
        title: BookTitle.from("書籍タイトル"),
        authorIds,
        version: 5,
      })
      const updated = book.update({
        title: BookTitle.from("更新後の書籍タイトル"),
        authorIds: nextAuthorIds,
      })
      expect(book.title.value).toBe("書籍タイトル")
      expect(book.authorIds).toEqual(authorIds)
      expect(book.version).toBe(5)
      expect(updated.id.value).toBe(id.value)
      expect(updated.title.value).toBe("更新後の書籍タイトル")
      expect(updated.authorIds).toEqual(nextAuthorIds)
      expect(updated.version).toBe(5)
    })

    it("authorIds が空の場合はエラーを投げる", () => {
      const book = Book.create({
        title: BookTitle.from("書籍タイトル"),
        authorIds: buildAuthorIds(1),
      })
      expect(() =>
        book.update({
          title: BookTitle.from("更新後の書籍タイトル"),
          authorIds: [],
        }),
      ).toThrow(InvalidBookAuthorsError)
    })
  })
})
