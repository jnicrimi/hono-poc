import { Link } from "@tanstack/react-router"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/shared/ui/pagination"

export function AuthorPagination({
  page,
  totalPages,
}: {
  readonly page: number
  readonly totalPages: number
}) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <Pagination>
      <PaginationContent>
        {pages.map((target) => (
          <PaginationItem key={target}>
            <Link
              to="/authors"
              search={{ page: target }}
              aria-current={target === page ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: target === page ? "default" : "ghost",
                  size: "icon",
                }),
              )}
            >
              {target}
            </Link>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  )
}
