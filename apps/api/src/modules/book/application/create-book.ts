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
  readonly title: string
  readonly authors: readonly {
    readonly id: string
    readonly name: string
  }[]
  readonly version: number
}

export class CreateBook {
  constructor(private readonly uow: BookUnitOfWork) {}

  async execute(command: CreateBookCommand): Promise<CreateBookResult> {
    return this.uow.run(async ({ repository, authorReader, reader }) => {
      const authorIds = await resolveAssignableAuthorIds(
        authorReader,
        command.authorIds,
      )
      const book = Book.create({
        title: BookTitle.from(command.title),
        authorIds,
      })
      await repository.insert(book)
      const created = await reader.findById(book.id)
      if (!created) {
        throw new Error(`作成後の書籍の取得に失敗しました: ${book.id.value}`)
      }
      return {
        id: created.id,
        title: created.title,
        authors: created.authors.map((author) => ({
          id: author.id,
          name: author.name,
        })),
        version: created.version,
      }
    })
  }
}
