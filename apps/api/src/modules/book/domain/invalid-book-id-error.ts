import { AppError, type ErrorCategory } from "../../../shared/error/app-error"

export class InvalidBookIdError extends AppError {
  readonly category: ErrorCategory = "BAD_REQUEST"
}
