import { createFileRoute } from "@tanstack/react-router"
import { getListAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { listAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { BookCreatePage } from "./-book-create-page"

export const Route = createFileRoute("/books/new")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      getListAuthorsQueryOptions({ perPage: listAuthorsQueryPerPageMax }),
    ),
  component: BookCreatePage,
})
