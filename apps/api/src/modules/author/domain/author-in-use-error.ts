import { entityLabels } from "../../../shared/entity-labels"
import { AppError, type ErrorCategory } from "../../../shared/error/app-error"
import { entityMessages } from "../../../shared/error/entity-messages"

export class AuthorInUseError extends AppError {
  readonly category: ErrorCategory = "CONFLICT"

  constructor(
    readonly authorId: string,
    options?: ErrorOptions,
  ) {
    super(
      entityMessages.inUse({
        entityLabel: entityLabels.author,
        assignedToLabel: entityLabels.book,
      }),
      options,
    )
  }
}
