import type { UnitOfWork } from "../../../shared/unit-of-work"
import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import type { BookRepository } from "../domain/book-repository"
import type { BookReader } from "./book-reader"

export type BookWork = {
  readonly repository: BookRepository
  readonly authorReader: AuthorExistenceReader
  readonly reader: BookReader
}

export type BookUnitOfWork = UnitOfWork<BookWork>
