import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { authorMessages } from "../text/author-messages"
import { AuthorRowActions } from "./author-row-actions"

const author = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "著者-1",
  version: 0,
}

const renderRowActions = (initialEntries?: readonly string[]) =>
  renderWithRouter(<AuthorRowActions author={author} />, {
    initialEntries,
    routes: [{ path: "/authors/$authorId", component: () => null }],
  })

describe("AuthorRowActions", () => {
  it("編集リンクが対象著者の編集画面を指す", async () => {
    renderRowActions()

    const link = await screen.findByRole("link", { name: "編集" })
    expect(link).toHaveAttribute("href", `/authors/${author.id}`)
  })

  it("ページ指定がある場合は編集リンクが現在のページを引き継ぐ", async () => {
    renderRowActions(["/?page=3"])

    const link = await screen.findByRole("link", { name: "編集" })
    expect(link).toHaveAttribute("href", `/authors/${author.id}?page=3`)
  })

  it("削除を確定すると DELETE を送り、トーストを表示してダイアログを閉じる", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    let deletedId: string | undefined
    server.use(
      http.delete("*/authors/:id", ({ params }) => {
        deletedId = String(params.id)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderRowActions()

    await user.click(await screen.findByRole("button", { name: "削除" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "削除" }))

    await waitFor(() => {
      expect(successSpy).toHaveBeenCalledWith(authorMessages.deleted)
    })
    expect(deletedId).toBe(author.id)
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    })
  })

  it("削除できない場合はサーバーメッセージをトーストで表示する", async () => {
    const user = userEvent.setup()
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("")
    server.use(
      http.delete("*/authors/:id", () =>
        HttpResponse.json(
          {
            errors: [{ message: "書籍に割り当てられているため削除できません" }],
          },
          { status: 409 },
        ),
      ),
    )

    renderRowActions()

    await user.click(await screen.findByRole("button", { name: "削除" }))
    const dialog = await screen.findByRole("alertdialog")
    await user.click(within(dialog).getByRole("button", { name: "削除" }))

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "書籍に割り当てられているため削除できません",
      )
    })
  })
})
