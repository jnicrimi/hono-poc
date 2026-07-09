import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { getGetAuthorsQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { getAuthorsQueryPageDefault } from "@/shared/api/generated/endpoints/authors/authors.zod"
import { AuthorsPage } from "./-authors-page"
import { authorListSearchSchema } from "./-authors-search"

export const Route = createFileRoute("/authors")({
  validateSearch: authorListSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: getAuthorsQueryPageDefault })],
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      getGetAuthorsQueryOptions({ page: deps.page }),
    ),
  component: AuthorsPage,
})
