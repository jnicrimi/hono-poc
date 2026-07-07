import { entityLabels } from "../../../shared/entity-labels"
import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"

export class BookNotFoundError extends AppError {
  readonly category: ErrorCategory = "NOT_FOUND"

  constructor(readonly bookId: string) {
    super(entityMessages.notFound(entityLabels.book))
  }
}
