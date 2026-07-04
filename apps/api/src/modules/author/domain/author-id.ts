import { validate as uuidValidate, v7 as uuidv7 } from "uuid"
import { validationMessages } from "../../../shared/error/validation-messages"
import { authorFieldLabels } from "./author-field-labels"
import { InvalidAuthorIdError } from "./invalid-author-id-error"

export class AuthorId {
  private constructor(readonly value: string) {}

  static generate(): AuthorId {
    return new AuthorId(uuidv7())
  }

  static restore(value: string): AuthorId {
    if (!uuidValidate(value)) {
      throw new InvalidAuthorIdError(
        validationMessages.invalidValue(authorFieldLabels.id),
      )
    }
    return new AuthorId(value)
  }
}
