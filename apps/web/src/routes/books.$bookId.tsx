import { createFileRoute } from "@tanstack/react-router"
import { getListAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { listAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { getShowBookQueryOptions } from "@/shared/api/generated/endpoints/books/books"
import { BookEditPage } from "./-book-edit-page"

export const Route = createFileRoute("/books/$bookId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        getShowBookQueryOptions(params.bookId),
      ),
      context.queryClient.ensureQueryData(
        getListAuthorsQueryOptions({ perPage: listAuthorsQueryPerPageMax }),
      ),
    ]),
  component: BookEditPage,
})
