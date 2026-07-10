import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import type { ApiError } from "@/shared/api/api-error"
import {
  getGetAuthorsQueryKey,
  usePostAuthors,
} from "@/shared/api/generated/endpoints/authors/authors"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { authorMessages } from "../text/author-messages"

export const useCreateAuthor = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return usePostAuthors<ApiError>({
    mutation: {
      onSuccess: () => {
        toast.success(authorMessages.created)
        void queryClient.invalidateQueries({
          queryKey: getGetAuthorsQueryKey(),
        })
        void navigate({ to: "/authors", search: true })
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error) ?? authorMessages.createFailed)
      },
    },
  })
}
