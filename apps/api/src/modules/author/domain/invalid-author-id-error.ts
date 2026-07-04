import { AppError, type ErrorCategory } from "../../../shared/error/app-error"

export class InvalidAuthorIdError extends AppError {
  readonly category: ErrorCategory = "BAD_REQUEST"
}
