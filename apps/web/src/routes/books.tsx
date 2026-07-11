import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { getListBooksQueryOptions } from "@/shared/api/generated/endpoints/books/books"
import { listBooksQueryPageDefault } from "@/shared/api/generated/endpoints/books/books.zod"
import { BooksPage } from "./-books-page"
import { bookListSearchSchema } from "./-books-search"

export const Route = createFileRoute("/books")({
  validateSearch: bookListSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: listBooksQueryPageDefault })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      getListBooksQueryOptions({ page: deps.page }),
    ),
  component: BooksPage,
})
