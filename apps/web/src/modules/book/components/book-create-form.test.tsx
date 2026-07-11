import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HttpResponse, http } from "msw"
import { toast } from "sonner"
import { describe, expect, it, vi } from "vitest"
import {
  getListAuthorsMockHandler,
  getListAuthorsResponseMock,
} from "@/shared/api/generated/endpoints/authors/authors.msw"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { bookMessages } from "../text/book-messages"
import { BookCreateForm } from "./book-create-form"

const authorId = "550e8400-e29b-41d4-a716-446655440000"

const stubAuthorOptions = () => {
  server.use(
    getListAuthorsMockHandler(
      getListAuthorsResponseMock({
        items: [{ id: authorId, name: "著者-1", version: 0 }],
        pagination: { page: 1, perPage: 100, total: 1, totalPages: 1 },
      }),
    ),
  )
}

const renderCreateForm = () =>
  renderWithRouter(<p>作成前のページ</p>, {
    initialEntries: ["/books/new"],
    routes: [
      { path: "/books/new", component: () => <BookCreateForm /> },
      { path: "/books", component: () => <p>書籍一覧ページ</p> },
    ],
  })

describe("BookCreateForm", () => {
  it("登録すると入力値が POST され、一覧へ遷移しトーストを表示する", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    stubAuthorOptions()
    let received: unknown
    server.use(
      http.post("*/books", async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
      }),
    )

    renderCreateForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.type(input, "書籍-1")
    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-1" }))
    await user.click(screen.getByRole("button", { name: "登録" }))

    expect(await screen.findByText("書籍一覧ページ")).toBeInTheDocument()
    expect(received).toEqual({ title: "書籍-1", authorIds: [authorId] })
    expect(successSpy).toHaveBeenCalledWith(bookMessages.created)
  })

  it("書籍タイトルが空の場合はバリデーションエラーになり送信しない", async () => {
    const user = userEvent.setup()
    stubAuthorOptions()
    let called = false
    server.use(
      http.post("*/books", () => {
        called = true
        return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
      }),
    )

    renderCreateForm()

    await user.click(await screen.findByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-1" }))
    await user.click(screen.getByRole("button", { name: "登録" }))

    expect(
      await screen.findByText("書籍タイトルを入力してください"),
    ).toBeInTheDocument()
    expect(called).toBe(false)
  })

  it("著者が未選択の場合はバリデーションエラーになり送信しない", async () => {
    const user = userEvent.setup()
    stubAuthorOptions()
    let called = false
    server.use(
      http.post("*/books", () => {
        called = true
        return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 })
      }),
    )

    renderCreateForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.type(input, "書籍-1")
    await user.click(screen.getByRole("button", { name: "登録" }))

    expect(
      await screen.findByText("著者を選択してください"),
    ).toBeInTheDocument()
    expect(called).toBe(false)
  })
})
