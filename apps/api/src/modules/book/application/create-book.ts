import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import { Book } from "../domain/book"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"
import { resolveAssignableAuthorIds } from "./assignable-author-ids-resolver"

export type CreateBookCommand = {
  readonly title: string
  readonly authorIds: readonly string[]
}

export type CreateBookResult = {
  readonly id: string
}

export class CreateBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly authorReader: AuthorExistenceReader,
  ) {}

  async execute(command: CreateBookCommand): Promise<CreateBookResult> {
    const authorIds = await resolveAssignableAuthorIds(
      this.authorReader,
      command.authorIds,
    )
    const book = Book.create({
      title: BookTitle.from(command.title),
      authorIds,
    })
    await this.repository.insert(book)
    return { id: book.id.value }
  }
}
