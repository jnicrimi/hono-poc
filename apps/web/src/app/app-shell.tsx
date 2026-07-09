import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

const NAV_ITEMS = [
  { to: "/", label: "ホーム", exact: true },
  { to: "/authors", label: "著者", exact: false },
  { to: "/books", label: "書籍", exact: false },
] as const

export function AppShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-8 px-4">
          <span className="font-semibold">PoC For Hono</span>
          <nav className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="text-sm transition-colors"
                activeProps={{ className: "font-medium text-foreground" }}
                inactiveProps={{
                  className: "text-muted-foreground hover:text-foreground",
                }}
              >
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
