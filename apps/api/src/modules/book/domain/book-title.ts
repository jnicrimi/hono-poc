import { validationMessages } from "../../../shared/error/validation-messages"
import { bookFieldLabels } from "./book-field-labels"
import { InvalidBookTitleError } from "./invalid-book-title-error"

export const BOOK_TITLE_MAX_LENGTH = 200

export class BookTitle {
  private constructor(readonly value: string) {}

  static from(value: string): BookTitle {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new InvalidBookTitleError(
        validationMessages.required(bookFieldLabels.title),
      )
    }
    if (trimmed.length > BOOK_TITLE_MAX_LENGTH) {
      throw new InvalidBookTitleError(
        validationMessages.maxLength(
          bookFieldLabels.title,
          BOOK_TITLE_MAX_LENGTH,
        ),
      )
    }
    return new BookTitle(trimmed)
  }
}
