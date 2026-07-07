import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"

export type UpdateBookCommand = {
  readonly id: string
  readonly title: string
  readonly version: number
}

export type UpdateBookResult = {
  readonly id: string
  readonly title: string
  readonly version: number
}

export class UpdateBook {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: UpdateBookCommand): Promise<UpdateBookResult> {
    const existing = await this.repository.findById(BookId.restore(command.id))
    if (!existing) {
      throw new BookNotFoundError(command.id)
    }
    const title = BookTitle.from(command.title)
    const saved = await this.repository.update(
      existing.update({ title }),
      command.version,
    )
    return {
      id: saved.id.value,
      title: saved.title.value,
      version: saved.version,
    }
  }
}
