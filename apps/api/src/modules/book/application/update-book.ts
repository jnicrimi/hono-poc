import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"
import { resolveAssignableAuthorIds } from "./assignable-author-ids-resolver"

export type UpdateBookCommand = {
  readonly id: string
  readonly title: string
  readonly authorIds: readonly string[]
  readonly version: number
}

export type UpdateBookResult = {
  readonly id: string
  readonly title: string
  readonly authorIds: readonly string[]
  readonly version: number
}

export class UpdateBook {
  constructor(
    private readonly repository: BookRepository,
    private readonly authorReader: AuthorExistenceReader,
  ) {}

  async execute(command: UpdateBookCommand): Promise<UpdateBookResult> {
    const existing = await this.repository.findById(BookId.restore(command.id))
    if (!existing) {
      throw new BookNotFoundError(command.id)
    }
    const authorIds = await resolveAssignableAuthorIds(
      this.authorReader,
      command.authorIds,
    )
    const saved = await this.repository.update(
      existing.update({ title: BookTitle.from(command.title), authorIds }),
      command.version,
    )
    return {
      id: saved.id.value,
      title: saved.title.value,
      authorIds: saved.authorIds.map((id) => id.value),
      version: saved.version,
    }
  }
}
