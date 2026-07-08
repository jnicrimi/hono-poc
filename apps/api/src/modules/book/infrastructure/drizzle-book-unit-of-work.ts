import type { Db } from "../../../shared/db/client"
import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import type { BookUnitOfWork, BookWork } from "../application/book-unit-of-work"
import { DrizzleBookRepository } from "./drizzle-book-repository"

export class DrizzleBookUnitOfWork implements BookUnitOfWork {
  constructor(
    private readonly db: Db,
    private readonly authorReaderOf: (db: Db) => AuthorExistenceReader,
  ) {}

  run<T>(work: (w: BookWork) => Promise<T>): Promise<T> {
    return this.db.transaction((tx) =>
      work({
        repository: new DrizzleBookRepository(tx),
        authorReader: this.authorReaderOf(tx),
      }),
    )
  }
}
