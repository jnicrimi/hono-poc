import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { getGetBooksQueryOptions } from "@/shared/api/generated/endpoints/books/books"
import { getBooksQueryPageDefault } from "@/shared/api/generated/endpoints/books/books.zod"
import { BooksPage } from "./-books-page"
import { bookListSearchSchema } from "./-books-search"

export const Route = createFileRoute("/books")({
  validateSearch: bookListSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: getBooksQueryPageDefault })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      getGetBooksQueryOptions({ page: deps.page }),
    ),
  component: BooksPage,
})
