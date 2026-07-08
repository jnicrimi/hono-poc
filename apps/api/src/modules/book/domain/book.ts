import { validationMessages } from "../../../shared/error/validation-messages"
import type { AuthorId } from "../../author/domain/author-id"
import { bookFieldLabels } from "./book-field-labels"
import { BookId } from "./book-id"
import type { BookTitle } from "./book-title"
import { InvalidBookAuthorsError } from "./invalid-book-authors-error"

export const BOOK_MAX_AUTHOR_IDS = 10

type BookProps = {
  readonly id: BookId
  readonly title: BookTitle
  readonly authorIds: readonly AuthorId[]
  readonly version: number
}

type BookCreateParams = {
  readonly title: BookTitle
  readonly authorIds: readonly AuthorId[]
}

type BookUpdateParams = {
  readonly title: BookTitle
  readonly authorIds: readonly AuthorId[]
}

export class Book {
  readonly id: BookId
  readonly title: BookTitle
  readonly authorIds: readonly AuthorId[]
  readonly version: number

  private constructor({ id, title, authorIds, version }: BookProps) {
    this.id = id
    this.title = title
    this.authorIds = authorIds
    this.version = version
  }

  private static validateAuthorIds(authorIds: readonly AuthorId[]): void {
    if (authorIds.length === 0) {
      throw new InvalidBookAuthorsError(
        validationMessages.minCount(bookFieldLabels.authorId, 1),
      )
    }
    if (authorIds.length > BOOK_MAX_AUTHOR_IDS) {
      throw new InvalidBookAuthorsError(
        validationMessages.maxCount(
          bookFieldLabels.authorId,
          BOOK_MAX_AUTHOR_IDS,
        ),
      )
    }
  }

  static create({ title, authorIds }: BookCreateParams): Book {
    Book.validateAuthorIds(authorIds)
    return new Book({
      id: BookId.generate(),
      title,
      authorIds,
      version: 0,
    })
  }

  static reconstruct(props: BookProps): Book {
    return new Book(props)
  }

  update({ title, authorIds }: BookUpdateParams): Book {
    Book.validateAuthorIds(authorIds)
    return new Book({ ...this, title, authorIds })
  }
}
