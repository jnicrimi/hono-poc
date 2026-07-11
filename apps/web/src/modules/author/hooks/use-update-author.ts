import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getListAuthorsQueryKey,
  getShowAuthorQueryKey,
  useUpdateAuthor as useUpdateAuthorRequest,
} from "@/shared/api/generated/endpoints/authors/authors"
import { getListBooksQueryKey } from "@/shared/api/generated/endpoints/books/books"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { authorMessages } from "../text/author-messages"

export const useUpdateAuthor = (authorId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useUpdateAuthorRequest<ApiError>({
    mutation: {
      onSuccess: () => {
        toast.success(authorMessages.updated)
        void queryClient.invalidateQueries({
          queryKey: getShowAuthorQueryKey(authorId),
        })
        void queryClient.invalidateQueries({
          queryKey: getListAuthorsQueryKey(),
        })
        void queryClient.invalidateQueries({
          queryKey: getListBooksQueryKey(),
        })
        void navigate({ to: "/authors", search: true })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          toast.error(feedbackMessages.conflictReload)
          return
        }
        toast.error(getApiErrorMessage(error) ?? authorMessages.updateFailed)
      },
    },
  })
}
