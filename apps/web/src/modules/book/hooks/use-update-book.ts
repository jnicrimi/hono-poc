import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetBooksIdQueryKey,
  getGetBooksQueryKey,
  usePatchBooksId,
} from "@/shared/api/generated/endpoints/books/books"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { bookMessages } from "../text/book-messages"

export const useUpdateBook = (bookId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return usePatchBooksId<ApiError>({
    mutation: {
      onSuccess: () => {
        toast.success(bookMessages.updated)
        void queryClient.invalidateQueries({
          queryKey: getGetBooksIdQueryKey(bookId),
        })
        void queryClient.invalidateQueries({
          queryKey: getGetBooksQueryKey(),
        })
        void navigate({ to: "/books", search: true })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          return
        }
        toast.error(getApiErrorMessage(error) ?? bookMessages.updateFailed)
      },
    },
  })
}
