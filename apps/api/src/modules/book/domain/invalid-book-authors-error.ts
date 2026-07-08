import { AppError, type ErrorCategory } from "../../../shared/error/app-error"

export class InvalidBookAuthorsError extends AppError {
  readonly category: ErrorCategory = "VALIDATION"
}
