import type { UnitOfWork } from "../../../shared/unit-of-work"
import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import type { BookRepository } from "../domain/book-repository"

export type BookWork = {
  readonly repository: BookRepository
  readonly authorReader: AuthorExistenceReader
}

export type BookUnitOfWork = UnitOfWork<BookWork>
