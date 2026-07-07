import { AppError, type ErrorCategory } from "../../../shared/error/app-error"

export class InvalidBookTitleError extends AppError {
  readonly category: ErrorCategory = "VALIDATION"
}
