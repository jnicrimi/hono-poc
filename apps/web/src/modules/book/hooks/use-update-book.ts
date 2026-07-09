import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetBooksIdQueryKey,
  getGetBooksQueryKey,
  usePatchBooksId,
} from "@/shared/api/generated/endpoints/books/books"
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
        void navigate({ to: "/books" })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          return
        }
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? bookMessages.updateFailed)
      },
    },
  })
}
