import { BookId } from "./book-id"
import type { BookTitle } from "./book-title"

type BookProps = {
  readonly id: BookId
  readonly title: BookTitle
  readonly version: number
}

type BookCreateParams = {
  readonly title: BookTitle
}

type BookUpdateParams = {
  readonly title: BookTitle
}

export class Book {
  readonly id: BookId
  readonly title: BookTitle
  readonly version: number

  private constructor({ id, title, version }: BookProps) {
    this.id = id
    this.title = title
    this.version = version
  }

  static create({ title }: BookCreateParams): Book {
    return new Book({
      id: BookId.generate(),
      title,
      version: 0,
    })
  }

  static reconstruct(props: BookProps): Book {
    return new Book(props)
  }

  update({ title }: BookUpdateParams): Book {
    return new Book({ ...this, title })
  }
}
