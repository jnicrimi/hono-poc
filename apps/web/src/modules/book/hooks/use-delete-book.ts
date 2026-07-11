import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ApiError } from "@/shared/api/api-error"
import {
  getListBooksQueryKey,
  getShowBookQueryKey,
  useDeleteBook as useDeleteBookRequest,
} from "@/shared/api/generated/endpoints/books/books"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { bookMessages } from "../text/book-messages"

export const useDeleteBook = () => {
  const queryClient = useQueryClient()

  return useDeleteBookRequest<ApiError>({
    mutation: {
      onSuccess: (_data, { id }) => {
        toast.success(bookMessages.deleted)
        queryClient.removeQueries({ queryKey: getShowBookQueryKey(id) })
        void queryClient.invalidateQueries({
          queryKey: getListBooksQueryKey(),
        })
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error) ?? bookMessages.deleteFailed)
      },
    },
  })
}
