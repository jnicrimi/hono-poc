import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"
import { authorEntityLabel } from "./author-entity-label"

export class AuthorInUseError extends AppError {
  readonly category: ErrorCategory = "CONFLICT"

  constructor(options?: ErrorOptions) {
    super(
      entityMessages.inUse({
        entityLabel: authorEntityLabel,
        assignedToLabel: "書籍",
      }),
      options,
    )
  }
}
