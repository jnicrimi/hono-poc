import { Book } from "../domain/book"
import { BookTitle } from "../domain/book-title"
import { resolveAssignableAuthorIds } from "./assignable-author-ids-resolver"
import type { BookUnitOfWork } from "./book-unit-of-work"

export type CreateBookCommand = {
  readonly title: string
  readonly authorIds: readonly string[]
}

export type CreateBookResult = {
  readonly id: string
}

export class CreateBook {
  constructor(private readonly uow: BookUnitOfWork) {}

  async execute(command: CreateBookCommand): Promise<CreateBookResult> {
    return this.uow.run(async ({ repository, authorReader }) => {
      const authorIds = await resolveAssignableAuthorIds(
        authorReader,
        command.authorIds,
      )
      const book = Book.create({
        title: BookTitle.from(command.title),
        authorIds,
      })
      await repository.insert(book)
      return { id: book.id.value }
    })
  }
}
