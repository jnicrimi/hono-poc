import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { getListAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { listAuthorsQueryPageDefault } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { AuthorsPage } from "./-authors-page"
import { authorListSearchSchema } from "./-authors-search"

export const Route = createFileRoute("/authors")({
  validateSearch: authorListSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: listAuthorsQueryPageDefault })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      getListAuthorsQueryOptions({ page: deps.page }),
    ),
  component: AuthorsPage,
})
