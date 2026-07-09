import { createFileRoute } from "@tanstack/react-router"
import { getGetAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { getAuthorsQueryPerPageMax } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { getGetBooksIdQueryOptions } from "@/shared/api/generated/endpoints/books/books"
import { BookEditPage } from "./-book-edit-page"

export const Route = createFileRoute("/books/$bookId")({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        getGetBooksIdQueryOptions(params.bookId),
      ),
      context.queryClient.ensureQueryData(
        getGetAuthorsQueryOptions({ perPage: getAuthorsQueryPerPageMax }),
      ),
    ]),
  component: BookEditPage,
})
