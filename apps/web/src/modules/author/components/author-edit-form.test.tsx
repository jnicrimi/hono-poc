import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { authorMessages } from "../text/author-messages"
import { AuthorEditForm } from "./author-edit-form"

const author = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "著者-1",
  version: 3,
}

const renderEditForm = () =>
  renderWithRouter(<AuthorEditForm author={author} />, {
    routes: [{ path: "/authors", component: () => <p>著者一覧ページ</p> }],
  })

describe("AuthorEditForm", () => {
  it("更新すると name と version が PATCH され、トーストを表示する", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    let received: unknown
    server.use(
      http.patch("*/authors/:id", async ({ request }) => {
        received = await request.json()
        return HttpResponse.json(
          { id: author.id, name: "著者-2", version: 4 },
          { status: 200 },
        )
      }),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "著者名" })
    await user.clear(input)
    await user.type(input, "著者-2")
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(await screen.findByText("著者一覧ページ")).toBeInTheDocument()
    expect(received).toEqual({ name: "著者-2", version: 3 })
    expect(successSpy).toHaveBeenCalledWith(authorMessages.updated)
  })

  it("version が競合した場合は競合メッセージを表示しトーストは出さない", async () => {
    const user = userEvent.setup()
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("")
    server.use(
      http.patch("*/authors/:id", () =>
        HttpResponse.json(
          { errors: [{ message: "他の更新と競合しました" }] },
          { status: 409 },
        ),
      ),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "著者名" })
    await user.clear(input)
    await user.type(input, "著者-2")
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(
      await screen.findByText(feedbackMessages.conflictReload),
    ).toBeInTheDocument()
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
