import { useListAuthorsSuspense } from "@/shared/api/generated/endpoints/authors/authors"
import { listAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"

export const useAuthorOptions = () => {
  const { data } = useListAuthorsSuspense({
    perPage: listAuthorsQueryPerPageMax,
  })
  return data.items
}
