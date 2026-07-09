import { useGetAuthorsSuspense } from "@/shared/api/generated/endpoints/authors/authors"
import { getAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"

export const useAuthorOptions = () => {
  const { data } = useGetAuthorsSuspense({
    perPage: getAuthorsQueryPerPageMax,
  })
  return data.items
}
