import { AppError, type ErrorCategory } from "./app-error"
import { entityMessages } from "./entity-messages"

export class OptimisticLockError extends AppError {
  readonly category: ErrorCategory = "CONFLICT"

  constructor(entityLabel: string) {
    super(entityMessages.conflict(entityLabel))
  }
}
