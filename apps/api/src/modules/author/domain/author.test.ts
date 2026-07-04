import { validate as uuidValidate } from "uuid"
import { describe, expect, it } from "vitest"
import { Author } from "./author"
import { AuthorId } from "./author-id"
import { AuthorName } from "./author-name"

describe("Author", () => {
  describe("create", () => {
    it("version 0 で生成する", () => {
      const author = Author.create({ name: AuthorName.from("著者名") })
      expect(uuidValidate(author.id.value)).toBe(true)
      expect(author.name.value).toBe("著者名")
      expect(author.version).toBe(0)
    })
  })

  describe("reconstruct", () => {
    it("渡した値のまま復元する", () => {
      const id = AuthorId.generate()
      const author = Author.reconstruct({
        id,
        name: AuthorName.from("著者名"),
        version: 1,
      })
      expect(author.id.value).toBe(id.value)
      expect(author.name.value).toBe("著者名")
      expect(author.version).toBe(1)
    })
  })

  describe("update", () => {
    it("名前だけ更新した新しいインスタンスを返す", () => {
      const id = AuthorId.generate()
      const author = Author.reconstruct({
        id,
        name: AuthorName.from("著者名"),
        version: 5,
      })
      const updated = author.update({
        name: AuthorName.from("更新後の著者名"),
      })
      expect(author.id.value).toBe(id.value)
      expect(author.name.value).toBe("著者名")
      expect(author.version).toBe(5)
      expect(updated.id.value).toBe(id.value)
      expect(updated.name.value).toBe("更新後の著者名")
      expect(updated.version).toBe(5)
    })
  })
})
