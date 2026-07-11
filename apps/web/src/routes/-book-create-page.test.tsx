import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { BookCreatePage } from "./-book-create-page"

describe("BookCreatePage", () => {
  it("ダイアログを閉じた場合は現在のページを保持したまま書籍一覧へ戻る", async () => {
    const user = userEvent.setup()
    const { router } = renderWithRouter(<BookCreatePage />, {
      initialEntries: ["/?page=3"],
      routes: [{ path: "/books", component: () => <p>書籍一覧ページ</p> }],
    })

    await user.click(await screen.findByRole("button", { name: "Close" }))

    expect(await screen.findByText("書籍一覧ページ")).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ page: 3 })
  })
})
