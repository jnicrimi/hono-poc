import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"
import { authorEntityLabel } from "./author-entity-label"

export class AuthorNotFoundError extends AppError {
  readonly category: ErrorCategory = "NOT_FOUND"

  constructor() {
    super(entityMessages.notFound(authorEntityLabel))
  }
}
