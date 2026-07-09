import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/shared/api/api-error"
import {
  getGetAuthorsIdQueryKey,
  getGetAuthorsQueryKey,
  useDeleteAuthorsId,
} from "@/shared/api/generated/endpoints/authors/authors"
import { authorMessages } from "../text/author-messages"

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()

  return useDeleteAuthorsId<ApiError>({
    mutation: {
      onSuccess: (_data, { id }) => {
        toast.success(authorMessages.deleted)
        queryClient.removeQueries({ queryKey: getGetAuthorsIdQueryKey(id) })
        void queryClient.invalidateQueries({
          queryKey: getGetAuthorsQueryKey(),
        })
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.errors[0]?.message : undefined
        toast.error(message ?? authorMessages.deleteFailed)
      },
    },
  })
}
