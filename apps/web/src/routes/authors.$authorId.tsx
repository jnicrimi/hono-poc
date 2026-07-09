import { createFileRoute } from "@tanstack/react-router"
import { getGetAuthorsIdQueryOptions } from "@/shared/api/generated/endpoints/authors/authors"
import { AuthorEditPage } from "./-author-edit-page"

export const Route = createFileRoute("/authors/$authorId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getGetAuthorsIdQueryOptions(params.authorId),
    ),
  component: AuthorEditPage,
})
