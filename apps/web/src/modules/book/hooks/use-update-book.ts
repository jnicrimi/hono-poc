import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getListBooksQueryKey,
  getShowBookQueryKey,
  useUpdateBook as useUpdateBookRequest,
} from "@/shared/api/generated/endpoints/books/books"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { bookMessages } from "../text/book-messages"

export const useUpdateBook = (bookId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useUpdateBookRequest({
    mutation: {
      onSuccess: () => {
        toast.success(bookMessages.updated)
        void queryClient.invalidateQueries({
          queryKey: getShowBookQueryKey(bookId),
        })
        void queryClient.invalidateQueries({
          queryKey: getListBooksQueryKey(),
        })
        void navigate({ to: "/books", search: true })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          toast.error(feedbackMessages.conflictReload)
          return
        }
        toast.error(getApiErrorMessage(error) ?? bookMessages.updateFailed)
      },
    },
  })
}
