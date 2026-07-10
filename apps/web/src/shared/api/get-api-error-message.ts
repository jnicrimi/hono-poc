import { ApiError } from "./api-error"

export const getApiErrorMessage = (error: unknown): string | undefined =>
  error instanceof ApiError ? error.errors[0]?.message : undefined
