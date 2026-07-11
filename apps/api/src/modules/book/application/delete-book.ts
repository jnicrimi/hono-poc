import { BookId } from "../domain/book-id"
import { BookNotFoundError } from "../domain/book-not-found-error"
import type { BookRepository } from "../domain/book-repository"

export type DeleteBookCommand = {
  readonly id: string
}

export class DeleteBook {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: DeleteBookCommand): Promise<void> {
    const bookId = BookId.restore(command.id)
    const existing = await this.repository.findById(bookId)
    if (!existing) {
      throw new BookNotFoundError()
    }
    await this.repository.delete(bookId)
  }
}
