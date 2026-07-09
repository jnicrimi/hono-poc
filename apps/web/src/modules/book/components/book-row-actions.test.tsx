import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { bookMessages } from "../text/book-messages"
import { BookRowActions } from "./book-row-actions"

const book = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "書籍-1",
  authors: [{ id: "550e8400-e29b-41d4-a716-446655440001", name: "著者-1" }],
  version: 0,
}

const renderRowActions = () =>
  renderWithRouter(<BookRowActions book={book} />, {
    routes: [{ path: "/books/$bookId", component: () => null }],
  })

describe("BookRowActions", () => {
  it("編集リンクが対象書籍の編集画面を指す", async () => {
    renderRowActions()

    const link = await screen.findByRole("link", { name: "編集" })
    expect(link).toHaveAttribute("href", `/books/${book.id}`)
  })

  it("削除を確定すると DELETE を送り、トーストを表示してダイアログを閉じる", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    let deletedId: string | undefined
    server.use(
      http.delete("*/books/:id", ({ params }) => {
        deletedId = String(params.id)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderRowActions()

    await user.click(await screen.findByRole("button", { name: "削除" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "削除" }))

    await waitFor(() => {
      expect(successSpy).toHaveBeenCalledWith(bookMessages.deleted)
    })
    expect(deletedId).toBe(book.id)
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    })
  })

  it("削除に失敗した場合はサーバーメッセージをトーストで表示する", async () => {
    const user = userEvent.setup()
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("")
    server.use(
      http.delete("*/books/:id", () =>
        HttpResponse.json(
          { errors: [{ message: "削除できません" }] },
          { status: 409 },
        ),
      ),
    )

    renderRowActions()

    await user.click(await screen.findByRole("button", { name: "削除" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "削除" }))

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("削除できません")
    })
  })
})
