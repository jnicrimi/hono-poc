import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { AppShell } from "./app-shell"

describe("AppShell", () => {
  it("ナビゲーションのリンクを表示する", async () => {
    renderWithRouter(
      <AppShell>
        <div />
      </AppShell>,
      {
        routes: [
          { path: "/authors", component: () => null },
          { path: "/books", component: () => null },
        ],
      },
    )
    expect(
      await screen.findByRole("link", { name: "Hono Poc" }),
    ).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "著者" })).toHaveAttribute(
      "href",
      "/authors",
    )
    expect(screen.getByRole("link", { name: "書籍" })).toHaveAttribute(
      "href",
      "/books",
    )
  })

  it("現在のルートに一致するリンクをアクティブ表示する", async () => {
    renderWithRouter(<div />, {
      initialEntries: ["/books"],
      routes: [
        { path: "/authors", component: () => null },
        {
          path: "/books",
          component: () => (
            <AppShell>
              <div />
            </AppShell>
          ),
        },
      ],
    })
    const active = await screen.findByRole("link", { name: "書籍" })
    expect(active).toHaveAttribute("data-status", "active")
    expect(screen.getByRole("link", { name: "Hono Poc" })).not.toHaveAttribute(
      "data-status",
      "active",
    )
  })
})
