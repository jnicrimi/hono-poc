export type ErrorDetail = {
  readonly field?: string
  readonly message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly errors: readonly ErrorDetail[]

  constructor(
    status: number,
    errors: readonly ErrorDetail[],
    options?: ErrorOptions,
  ) {
    super(`API request failed with status ${status}`, options)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}
