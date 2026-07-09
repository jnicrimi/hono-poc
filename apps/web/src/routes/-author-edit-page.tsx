import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { AuthorEditForm } from "@/modules/author/components/author-edit-form"
import { authorLabels } from "@/modules/author/text/author-labels"
import { useGetAuthorsIdSuspense } from "@/shared/api/generated/endpoints/authors/authors"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

const route = getRouteApi("/authors/$authorId")

export function AuthorEditPage() {
  const { authorId } = route.useParams()
  const { data: author } = useGetAuthorsIdSuspense(authorId)
  const navigate = useNavigate()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          void navigate({ to: "/authors" })
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{authorLabels.editTitle}</DialogTitle>
        </DialogHeader>
        <AuthorEditForm author={author} />
      </DialogContent>
    </Dialog>
  )
}
