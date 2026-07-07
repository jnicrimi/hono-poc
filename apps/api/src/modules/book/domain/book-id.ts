import { validate as uuidValidate, v7 as uuidv7 } from "uuid"
import { validationMessages } from "../../../shared/error/validation-messages"
import { bookFieldLabels } from "./book-field-labels"
import { InvalidBookIdError } from "./invalid-book-id-error"

export class BookId {
  private constructor(readonly value: string) {}

  static generate(): BookId {
    return new BookId(uuidv7())
  }

  static restore(value: string): BookId {
    if (!uuidValidate(value)) {
      throw new InvalidBookIdError(
        validationMessages.invalidValue(bookFieldLabels.id),
      )
    }
    return new BookId(value)
  }
}
