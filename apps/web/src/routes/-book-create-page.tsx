import { useNavigate } from "@tanstack/react-router"
import { BookCreateForm } from "@/modules/book/components/book-create-form"
import { bookLabels } from "@/modules/book/text/book-labels"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

export function BookCreatePage() {
  const navigate = useNavigate()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          void navigate({ to: "/books" })
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bookLabels.createTitle}</DialogTitle>
        </DialogHeader>
        <BookCreateForm />
      </DialogContent>
    </Dialog>
  )
}
