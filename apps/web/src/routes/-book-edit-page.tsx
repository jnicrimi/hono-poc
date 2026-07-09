import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { BookEditForm } from "@/modules/book/components/book-edit-form"
import { bookLabels } from "@/modules/book/text/book-labels"
import { useGetBooksIdSuspense } from "@/shared/api/generated/endpoints/books/books"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

const route = getRouteApi("/books/$bookId")

export function BookEditPage() {
  const { bookId } = route.useParams()
  const { data: book } = useGetBooksIdSuspense(bookId)
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
          <DialogTitle>{bookLabels.editTitle}</DialogTitle>
        </DialogHeader>
        <BookEditForm book={book} />
      </DialogContent>
    </Dialog>
  )
}
