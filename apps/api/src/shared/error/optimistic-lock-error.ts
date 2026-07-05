import { entityLabels } from "../entity-labels"
import type { EntityName } from "../entity-name"
import { AppError, type ErrorCategory } from "./app-error"
import { entityMessages } from "./entity-messages"

export class OptimisticLockError extends AppError {
  readonly category: ErrorCategory = "CONFLICT"

  constructor(
    entityName: EntityName,
    readonly entityId: string,
  ) {
    super(entityMessages.conflict(entityLabels[entityName]))
  }
}
