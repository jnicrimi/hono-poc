import { entityLabels } from "../../../shared/entity-labels"
import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"

export class AuthorsNotAssignableError extends AppError {
  readonly category: ErrorCategory = "BAD_REQUEST"

  constructor(readonly authorIds: readonly string[]) {
    super(entityMessages.notAssignable(entityLabels.author))
  }
}
