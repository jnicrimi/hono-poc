import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  getListBooksQueryKey,
  useCreateBook as useCreateBookRequest,
} from "@/shared/api/generated/endpoints/books/books"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { bookMessages } from "../text/book-messages"

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useCreateBookRequest({
    mutation: {
      onSuccess: () => {
        toast.success(bookMessages.created)
        void queryClient.invalidateQueries({
          queryKey: getListBooksQueryKey(),
        })
        void navigate({ to: "/books", search: true })
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error) ?? bookMessages.createFailed)
      },
    },
  })
}
