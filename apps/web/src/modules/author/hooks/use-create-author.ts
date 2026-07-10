import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetAuthorsQueryKey,
  usePostAuthors,
} from "@/shared/api/generated/endpoints/authors/authors"
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
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? authorMessages.createFailed)
      },
    },
  })
}
