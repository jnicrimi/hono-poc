import { createAuthorExistenceReaderStub } from "../../author/contract/test-support/author-existence-reader-stub"
import type { BookUnitOfWork, BookWork } from "../application/book-unit-of-work"
import { createBookReaderStub } from "./book-reader-stub"
import { createBookRepositoryStub } from "./book-repository-stub"

export const createBookUnitOfWorkStub = (
  overrides: Partial<BookWork> = {},
): BookUnitOfWork => {
  const work: BookWork = {
    repository: createBookRepositoryStub(),
    authorReader: createAuthorExistenceReaderStub(),
    reader: createBookReaderStub(),
    ...overrides,
  }
  return { run: (fn) => fn(work) }
}
