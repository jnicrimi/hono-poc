import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetBooksIdQueryKey,
  getGetBooksQueryKey,
  useDeleteBooksId,
} from "@/shared/api/generated/endpoints/books/books"
import { bookMessages } from "../text/book-messages"

export const useDeleteBook = () => {
  const queryClient = useQueryClient()

  return useDeleteBooksId<ApiError>({
    mutation: {
      onSuccess: (_data, { id }) => {
        toast.success(bookMessages.deleted)
        queryClient.removeQueries({ queryKey: getGetBooksIdQueryKey(id) })
        void queryClient.invalidateQueries({
          queryKey: getGetBooksQueryKey(),
        })
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? bookMessages.deleteFailed)
      },
    },
  })
}
