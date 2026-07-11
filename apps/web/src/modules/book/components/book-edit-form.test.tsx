import { screen, waitFor } from "@testing-library/react"
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
import { feedbackMessages } from "@/shared/text/feedback-messages"
import { bookMessages } from "../text/book-messages"
import { BookEditForm } from "./book-edit-form"

const authorId1 = "550e8400-e29b-41d4-a716-446655440001"
const authorId2 = "550e8400-e29b-41d4-a716-446655440002"

const book = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "書籍-1",
  authors: [{ id: authorId1, name: "著者-1" }],
  version: 3,
}

const stubAuthorOptions = () => {
  server.use(
    getListAuthorsMockHandler(
      getListAuthorsResponseMock({
        items: [
          { id: authorId1, name: "著者-1", version: 0 },
          { id: authorId2, name: "著者-2", version: 0 },
        ],
        pagination: { page: 1, perPage: 100, total: 2, totalPages: 1 },
      }),
    ),
  )
}

const renderEditForm = () =>
  renderWithRouter(<BookEditForm book={book} />, {
    routes: [{ path: "/books", component: () => <p>書籍一覧ページ</p> }],
  })

describe("BookEditForm", () => {
  it("タイトルを変更して更新すると現在の authorIds と version 込みで PATCH される", async () => {
    const user = userEvent.setup()
    const successSpy = vi.spyOn(toast, "success").mockReturnValue("")
    stubAuthorOptions()
    let received: unknown
    server.use(
      http.patch("*/books/:id", async ({ request }) => {
        received = await request.json()
        return HttpResponse.json(
          { ...book, title: "書籍-2", version: 4 },
          { status: 200 },
        )
      }),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.clear(input)
    await user.type(input, "書籍-2")
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(await screen.findByText("書籍一覧ページ")).toBeInTheDocument()
    expect(received).toEqual({
      title: "書籍-2",
      authorIds: [authorId1],
      version: 3,
    })
    expect(successSpy).toHaveBeenCalledWith(bookMessages.updated)
  })

  it("著者を追加して更新すると authorIds に追加される", async () => {
    const user = userEvent.setup()
    stubAuthorOptions()
    let received: unknown
    server.use(
      http.patch("*/books/:id", async ({ request }) => {
        received = await request.json()
        return HttpResponse.json({ ...book, version: 4 }, { status: 200 })
      }),
    )

    renderEditForm()

    await user.click(await screen.findByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-2" }))
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(await screen.findByText("書籍一覧ページ")).toBeInTheDocument()
    expect(received).toEqual({
      title: "書籍-1",
      authorIds: [authorId1, authorId2],
      version: 3,
    })
  })

  it("著者をすべて解除すると選択必須のエラーになり送信しない", async () => {
    const user = userEvent.setup()
    stubAuthorOptions()
    let called = false
    server.use(
      http.patch("*/books/:id", () => {
        called = true
        return HttpResponse.json({ ...book, version: 4 }, { status: 200 })
      }),
    )

    renderEditForm()

    await user.click(await screen.findByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-1" }))
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(
      await screen.findByText("著者を選択してください"),
    ).toBeInTheDocument()
    expect(called).toBe(false)
  })

  it("書籍タイトルが空の場合はバリデーションエラーになり送信しない", async () => {
    const user = userEvent.setup()
    stubAuthorOptions()
    let called = false
    server.use(
      http.patch("*/books/:id", () => {
        called = true
        return HttpResponse.json({ ...book, version: 4 }, { status: 200 })
      }),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.clear(input)
    await user.click(screen.getByRole("button", { name: "更新" }))

    expect(
      await screen.findByText("書籍タイトルを入力してください"),
    ).toBeInTheDocument()
    expect(called).toBe(false)
  })

  it("version が競合した場合は競合トーストを表示し入力を保持する", async () => {
    const user = userEvent.setup()
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("")
    stubAuthorOptions()
    server.use(
      http.patch("*/books/:id", () =>
        HttpResponse.json(
          { errors: [{ message: "他の更新と競合しました" }] },
          { status: 409 },
        ),
      ),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.clear(input)
    await user.type(input, "書籍-2")
    await user.click(screen.getByRole("button", { name: "更新" }))

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(feedbackMessages.conflictReload)
    })
    expect(input).toHaveValue("書籍-2")
  })

  it("409 以外のエラーはトーストを表示し入力を保持する", async () => {
    const user = userEvent.setup()
    const errorSpy = vi.spyOn(toast, "error").mockReturnValue("")
    stubAuthorOptions()
    server.use(
      http.patch("*/books/:id", () =>
        HttpResponse.json(
          { errors: [{ message: "サーバーエラーです" }] },
          { status: 500 },
        ),
      ),
    )

    renderEditForm()

    const input = await screen.findByRole("textbox", { name: "書籍タイトル" })
    await user.clear(input)
    await user.type(input, "書籍-2")
    await user.click(screen.getByRole("button", { name: "更新" }))

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("サーバーエラーです")
    })
    expect(errorSpy).not.toHaveBeenCalledWith(feedbackMessages.conflictReload)
    expect(input).toHaveValue("書籍-2")
  })
})
