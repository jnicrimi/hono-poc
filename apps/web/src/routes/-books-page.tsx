import { getRouteApi, Link, Outlet } from "@tanstack/react-router"
import { Book } from "lucide-react"
import { BookList } from "@/modules/book/components/book-list"
import { PageTitle } from "@/shared/components/page-title"
import { uiLabels } from "@/shared/text/ui-labels"
import { buttonVariants } from "@/shared/ui/button"

const route = getRouteApi("/books")

export function BooksPage() {
  const { page } = route.useSearch()

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        icon={Book}
        action={
          <Link to="/books/new" search={true} className={buttonVariants()}>
            {uiLabels.create}
          </Link>
        }
      >
        書籍
      </PageTitle>
      <BookList page={page} />
      <Outlet />
    </div>
  )
}
