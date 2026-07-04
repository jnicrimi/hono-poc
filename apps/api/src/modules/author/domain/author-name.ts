import { validationMessages } from "../../../shared/error/validation-messages"
import { authorFieldLabels } from "./author-field-labels"
import { InvalidAuthorNameError } from "./invalid-author-name-error"

export const AUTHOR_NAME_MAX_LENGTH = 100

export class AuthorName {
  private constructor(readonly value: string) {}

  static from(value: string): AuthorName {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      throw new InvalidAuthorNameError(
        validationMessages.required(authorFieldLabels.name),
      )
    }
    if (trimmed.length > AUTHOR_NAME_MAX_LENGTH) {
      throw new InvalidAuthorNameError(
        validationMessages.maxLength(
          authorFieldLabels.name,
          AUTHOR_NAME_MAX_LENGTH,
        ),
      )
    }
    return new AuthorName(trimmed)
  }
}
