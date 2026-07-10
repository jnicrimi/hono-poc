import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { AuthorCreatePage } from "./-author-create-page"

describe("AuthorCreatePage", () => {
  it("ダイアログを閉じた場合は現在のページを保持したまま著者一覧へ戻る", async () => {
    const user = userEvent.setup()
    const { router } = renderWithRouter(<AuthorCreatePage />, {
      initialEntries: ["/?page=3"],
      routes: [{ path: "/authors", component: () => <p>著者一覧ページ</p> }],
    })

    await user.click(await screen.findByRole("button", { name: "Close" }))

    expect(await screen.findByText("著者一覧ページ")).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ page: 3 })
  })
})
