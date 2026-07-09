import { getRouteApi, Link, Outlet } from "@tanstack/react-router"
import { User } from "lucide-react"
import { AuthorList } from "@/modules/author/components/author-list"
import { PageTitle } from "@/shared/components/page-title"
import { uiLabels } from "@/shared/text/ui-labels"
import { buttonVariants } from "@/shared/ui/button"

const route = getRouteApi("/authors")

export function AuthorsPage() {
  const { page } = route.useSearch()

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        icon={User}
        action={
          <Link to="/authors/new" className={buttonVariants()}>
            {uiLabels.create}
          </Link>
        }
      >
        著者
      </PageTitle>
      <AuthorList page={page} />
      <Outlet />
    </div>
  )
}
