import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getListAuthorsQueryKey,
  getShowAuthorQueryKey,
  useDeleteAuthor as useDeleteAuthorRequest,
} from "@/shared/api/generated/endpoints/authors/authors"
import { getApiErrorMessage } from "@/shared/api/get-api-error-message"
import { authorMessages } from "../text/author-messages"

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()

  return useDeleteAuthorRequest({
    mutation: {
      onSuccess: (_data, { id }) => {
        toast.success(authorMessages.deleted)
        queryClient.removeQueries({ queryKey: getShowAuthorQueryKey(id) })
        void queryClient.invalidateQueries({
          queryKey: getListAuthorsQueryKey(),
        })
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error) ?? authorMessages.deleteFailed)
      },
    },
  })
}
