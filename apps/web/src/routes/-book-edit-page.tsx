import { getRouteApi, useNavigate } from "@tanstack/react-router"
import { BookEditForm } from "@/modules/book/components/book-edit-form"
import { bookLabels } from "@/modules/book/text/book-labels"
import { useGetBooksIdSuspense } from "@/shared/api/generated/endpoints/books/books"
import { RouteDialog } from "@/shared/components/route-dialog"

const route = getRouteApi("/books/$bookId")

export function BookEditPage() {
  const { bookId } = route.useParams()
  const { data: book } = useGetBooksIdSuspense(bookId)
  const navigate = useNavigate()

  return (
    <RouteDialog
      title={bookLabels.editTitle}
      onClose={() => {
        void navigate({ to: "/books", search: true })
      }}
    >
      <BookEditForm book={book} />
    </RouteDialog>
  )
}
