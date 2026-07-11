import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"
import { bookEntityLabel } from "./book-entity-label"

export class BookNotFoundError extends AppError {
  readonly category: ErrorCategory = "NOT_FOUND"

  constructor() {
    super(entityMessages.notFound(bookEntityLabel))
  }
}
