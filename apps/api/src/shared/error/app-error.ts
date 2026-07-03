export type ErrorCategory =
  | "VALIDATION"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "NOT_FOUND"

export abstract class AppError extends Error {
  abstract readonly category: ErrorCategory

  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}
