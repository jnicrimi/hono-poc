import { useNavigate } from "@tanstack/react-router"
import { AuthorCreateForm } from "@/modules/author/components/author-create-form"
import { authorLabels } from "@/modules/author/text/author-labels"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

export function AuthorCreatePage() {
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
          <DialogTitle>{authorLabels.createTitle}</DialogTitle>
        </DialogHeader>
        <AuthorCreateForm />
      </DialogContent>
    </Dialog>
  )
}
