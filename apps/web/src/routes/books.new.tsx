import { createFileRoute } from "@tanstack/react-router"
import { getGetAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { getAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { BookCreatePage } from "./-book-create-page"

export const Route = createFileRoute("/books/new")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      getGetAuthorsQueryOptions({ perPage: getAuthorsQueryPerPageMax }),
    ),
  component: BookCreatePage,
})
