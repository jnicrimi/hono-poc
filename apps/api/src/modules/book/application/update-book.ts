import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import { BookTitle } from "../domain/book-title"
import { resolveAssignableAuthorIds } from "./assignable-author-ids-resolver"
import type { BookUnitOfWork } from "./book-unit-of-work"

export type UpdateBookCommand = {
  readonly id: string
  readonly title: string
  readonly authorIds: readonly string[]
  readonly version: number
}

export type UpdateBookResult = {
  readonly id: string
  readonly title: string
  readonly authors: readonly {
    readonly id: string
    readonly name: string
  }[]
  readonly version: number
}

export class UpdateBook {
  constructor(private readonly uow: BookUnitOfWork) {}

  async execute(command: UpdateBookCommand): Promise<UpdateBookResult> {
    return this.uow.run(async ({ repository, authorReader, reader }) => {
      const existing = await repository.findById(BookId.restore(command.id))
      if (!existing) {
        throw new BookNotFoundError(command.id)
      }
      const authorIds = await resolveAssignableAuthorIds(
        authorReader,
        command.authorIds,
      )
      const saved = await repository.update(
        existing.update({ title: BookTitle.from(command.title), authorIds }),
        command.version,
      )
      const updated = await reader.findById(saved.id)
      if (!updated) {
        throw new Error(`更新後の書籍の取得に失敗しました: ${command.id}`)
      }
      return {
        id: updated.id,
        title: updated.title,
        authors: updated.authors.map((author) => ({
          id: author.id,
          name: author.name,
        })),
        version: updated.version,
      }
    })
  }
}
