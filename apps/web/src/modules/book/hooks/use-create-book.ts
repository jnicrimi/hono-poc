import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetBooksQueryKey,
  usePostBooks,
} from "@/shared/api/generated/endpoints/books/books"
import { bookMessages } from "../text/book-messages"

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return usePostBooks<ApiError>({
    mutation: {
      onSuccess: () => {
        toast.success(bookMessages.created)
        void queryClient.invalidateQueries({
          queryKey: getGetBooksQueryKey(),
        })
        void navigate({ to: "/books" })
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? bookMessages.createFailed)
      },
    },
  })
}
