import { Book } from "../domain/book"
import type { BookRepository } from "../domain/book-repository"
import { BookTitle } from "../domain/book-title"

export type CreateBookCommand = {
  readonly title: string
}

export type CreateBookResult = {
  readonly id: string
}

export class CreateBook {
  constructor(private readonly repository: BookRepository) {}

  async execute(command: CreateBookCommand): Promise<CreateBookResult> {
    const book = Book.create({ title: BookTitle.from(command.title) })
    await this.repository.insert(book)
    return { id: book.id.value }
  }
}
