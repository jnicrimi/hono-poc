import { AppError, type ErrorCategory } from "../../../shared/error/app-error"

export class InvalidAuthorNameError extends AppError {
  readonly category: ErrorCategory = "VALIDATION"
}
