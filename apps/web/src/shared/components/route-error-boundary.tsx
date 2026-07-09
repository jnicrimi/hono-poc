import type { ErrorComponentProps } from "@tanstack/react-router"
import { ApiError } from "@/shared/api/api-error"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { ErrorState } from "./error-state"

export function RouteErrorBoundary({ error }: ErrorComponentProps) {
  const description =
    error instanceof ApiError && error.status === 0
      ? feedbackMessages.networkError
      : feedbackMessages.loadError

  return <ErrorState description={description} />
}
