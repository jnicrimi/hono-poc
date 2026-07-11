import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { AuthorEditForm } from "@/modules/author/components/author-edit-form"
import { authorLabels } from "@/modules/author/text/author-labels"
import { useShowAuthorSuspense } from "@/shared/api/generated/endpoints/authors/authors"
import { RouteDialog } from "@/shared/components/route-dialog"

const route = getRouteApi("/authors/$authorId")

export function AuthorEditPage() {
  const { authorId } = route.useParams()
  const { data: author } = useShowAuthorSuspense(authorId)
  const navigate = useNavigate()

  return (
    <RouteDialog
      title={authorLabels.editTitle}
      onClose={() => {
        void navigate({ to: "/authors", search: true })
      }}
    >
      <AuthorEditForm author={author} />
    </RouteDialog>
  )
}
