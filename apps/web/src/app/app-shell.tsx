import { Link } from "@tanstack/react-router"
import { Book, User } from "lucide-react"
import type { ReactNode } from "react"
import { navLabels } from "@/shared/text/nav-labels"

const NAV_ITEMS = [
  { to: "/authors", label: navLabels.authors, icon: User },
  { to: "/books", label: navLabels.books, icon: Book },
] as const

export function AppShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-4">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="font-semibold"
          >
            Hono Poc
          </Link>
          <nav className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-1.5 text-sm transition-colors"
                activeProps={{ className: "font-medium text-foreground" }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground",
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
