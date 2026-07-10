import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { authorMessages } from "../text/author-messages"
import { AuthorCreateForm } from "./author-create-form"

const renderCreateForm = (
  initialEntries: readonly string[] = ["/authors/new"],
) =>
  renderWithRouter(<p>作成前のページ</p>, {
    initialEntries,
    routes: [
      { path: "/authors/new", component: () => <AuthorCreateForm /> },
      { path: "/authors", component: () => <p>著者一覧ページ</p> },
    ],
  })

describe("AuthorCreateForm", () => {
  it("登録すると入力値が POST され、一覧へ遷移しトーストを表示する", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    let received: unknown
    server.use(
      http.post("*/authors", async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
      }),
    )

    renderCreateForm()

    const input = await screen.findByRole("textbox", { name: "著者名" })
    await user.type(input, "著者-1")
    await user.click(screen.getByRole("button", { name: "登録" }))

    expect(await screen.findByText("著者一覧ページ")).toBeInTheDocument()
    expect(received).toEqual({ name: "著者-1" })
    expect(successSpy).toHaveBeenCalledWith(authorMessages.created)
  })

  it("ページ指定がある場合は登録後も現在のページを保持して一覧へ遷移する", async () => {
    const user = userEvent.setup()
    vi.spyOn(toast, "success").mockReturnValue("")
    server.use(
      http.post("*/authors", () =>
        HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 }),
      ),
    )

    const { router } = renderCreateForm(["/authors/new?page=3"])

    const input = await screen.findByRole("textbox", { name: "著者名" })
    await user.type(input, "著者-1")
    await user.click(screen.getByRole("button", { name: "登録" }))

    expect(await screen.findByText("著者一覧ページ")).toBeInTheDocument()
    expect(router.state.location.search).toEqual({ page: 3 })
  })

  it("著者名が空の場合はバリデーションエラーになり送信しない", async () => {
    const user = userEvent.setup()
    let called = false
    server.use(
      http.post("*/authors", () => {
        called = true
        return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
      }),
    )

    renderCreateForm()

    const button = await screen.findByRole("button", { name: "登録" })
    await user.click(button)

    expect(
      await screen.findByText("著者名を入力してください"),
    ).toBeInTheDocument()
    expect(called).toBe(false)
  })
})
