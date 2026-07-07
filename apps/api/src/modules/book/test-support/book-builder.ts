import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookTitle } from "../domain/book-title"

type BuildBookOverrides = {
  readonly id?: string
  readonly title?: string
  readonly version?: number
}

export const buildBook = (overrides: BuildBookOverrides = {}): Book =>
  Book.reconstruct({
    id: BookId.restore(overrides.id ?? VALID_UUID_V7),
    title: BookTitle.from(overrides.title ?? "書籍タイトル"),
    version: overrides.version ?? 0,
  })
