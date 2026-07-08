import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { AuthorId } from "../../author/domain/author-id"
import { Book } from "../domain/book"
import { BookId } from "../domain/book-id"
import { BookTitle } from "../domain/book-title"

type BuildBookOverrides = {
  readonly id?: string
  readonly title?: string
  readonly authorIds?: readonly string[]
  readonly version?: number
}

export const buildBook = (overrides: BuildBookOverrides = {}): Book =>
  Book.reconstruct({
    id: BookId.restore(overrides.id ?? VALID_UUID_V7),
    title: BookTitle.from(overrides.title ?? "書籍タイトル"),
    authorIds: (overrides.authorIds ?? [VALID_UUID_V7]).map((value) =>
      AuthorId.restore(value),
    ),
    version: overrides.version ?? 0,
  })
