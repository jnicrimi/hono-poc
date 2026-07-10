import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ApiError } from "@/shared/api/api-error"
import {
  getGetAuthorsIdQueryKey,
  getGetAuthorsQueryKey,
  useDeleteAuthorsId,
} from "@/shared/api/generated/endpoints/authors/authors"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
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
        toast.error(getApiErrorMessage(error) ?? authorMessages.deleteFailed)
      },
    },
  })
}
