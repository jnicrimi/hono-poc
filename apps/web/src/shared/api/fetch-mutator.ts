import { env } from "@/shared/config/env"
import { ApiError, type ErrorDetail } from "./api-error"

const NETWORK_ERROR_MESSAGE = "ネットワークエラーが発生しました"
const UNEXPECTED_ERROR_MESSAGE = "予期しないエラーが発生しました"

const isErrorEnvelope = (
  body: unknown,
): body is { errors: readonly ErrorDetail[] } =>
  typeof body === "object" &&
  body !== null &&
  "errors" in body &&
  Array.isArray(body.errors) &&
  body.errors.length > 0

const parseErrorDetails = async (
  response: Response,
): Promise<readonly ErrorDetail[]> => {
  const body: unknown = await response.json().catch(() => null)
  if (isErrorEnvelope(body)) {
    return body.errors
  }
  return [{ message: UNEXPECTED_ERROR_MESSAGE }]
}

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const response = await fetch(`${env.VITE_API_URL}${url}`, options).catch(
    (error: unknown) => {
      throw new ApiError(0, [{ message: NETWORK_ERROR_MESSAGE }], {
        cause: error,
      })
    },
  )

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetails(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body: unknown = await response.json().catch((error: unknown) => {
    throw new ApiError(
      response.status,
      [{ message: UNEXPECTED_ERROR_MESSAGE }],
      { cause: error },
    )
  })
  return body as T
}
