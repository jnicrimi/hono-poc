import { useNavigate } from "@tanstack/react-router"
import { BookCreateForm } from "@/modules/book/components/book-create-form"
import { bookLabels } from "@/modules/book/text/book-labels"
import { RouteDialog } from "@/shared/components/route-dialog"

export function BookCreatePage() {
  const navigate = useNavigate()

  return (
    <RouteDialog
      title={bookLabels.createTitle}
      onClose={() => {
        void navigate({ to: "/books", search: true })
      }}
    >
      <BookCreateForm />
    </RouteDialog>
  )
}
