import { env } from "@/shared/config/env"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { ApiError, type ErrorDetail } from "./api-error"

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
  return [{ message: feedbackMessages.unexpectedError }]
}

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const response = await fetch(`${env.VITE_API_URL}${url}`, options).catch(
    (error: unknown) => {
      throw new ApiError(0, [{ message: feedbackMessages.networkError }], {
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
      [{ message: feedbackMessages.unexpectedError }],
      { cause: error },
    )
  })
  return body as T
}
