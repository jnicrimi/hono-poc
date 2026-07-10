import { useNavigate } from "@tanstack/react-router"
import { AuthorCreateForm } from "@/modules/author/components/author-create-form"
import { authorLabels } from "@/modules/author/text/author-labels"
import { RouteDialog } from "@/shared/components/route-dialog"

export function AuthorCreatePage() {
  const navigate = useNavigate()

  return (
    <RouteDialog
      title={authorLabels.createTitle}
      onClose={() => {
        void navigate({ to: "/authors", search: true })
      }}
    >
      <AuthorCreateForm />
    </RouteDialog>
  )
}
