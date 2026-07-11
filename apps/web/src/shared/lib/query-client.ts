import { QueryClient } from "@tanstack/react-query"
import { ApiError } from "@/shared/api/api-error"

const MAX_RETRY_COUNT = 1

export const shouldRetryQuery = (
  failureCount: number,
  error: unknown,
): boolean =>
  failureCount < MAX_RETRY_COUNT &&
  error instanceof ApiError &&
  (error.status === 0 || error.status >= 500)

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: false,
      },
    },
  })
