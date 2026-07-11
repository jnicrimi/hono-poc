import { createFileRoute } from "@tanstack/react-router"
import { getShowAuthorQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { AuthorEditPage } from "./-author-edit-page"

export const Route = createFileRoute("/authors/$authorId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getShowAuthorQueryOptions(params.authorId),
    ),
  component: AuthorEditPage,
})
