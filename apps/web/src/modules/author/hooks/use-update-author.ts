import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetAuthorsIdQueryKey,
  getGetAuthorsQueryKey,
  usePatchAuthorsId,
} from "@/shared/api/generated/endpoints/authors/authors"
import { authorMessages } from "../text/author-messages"

export const useUpdateAuthor = (authorId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return usePatchAuthorsId<ApiError>({
    mutation: {
      onSuccess: () => {
        toast.success(authorMessages.updated)
        void queryClient.invalidateQueries({
          queryKey: getGetAuthorsIdQueryKey(authorId),
        })
        void queryClient.invalidateQueries({
          queryKey: getGetAuthorsQueryKey(),
        })
        void navigate({ to: "/authors" })
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          return
        }
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? authorMessages.updateFailed)
      },
    },
  })
}
