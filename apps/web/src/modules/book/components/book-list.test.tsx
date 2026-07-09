import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  getGetBooksMockHandler,
  getGetBooksResponseMock,
} from "@/shared/api/generated/endpoints/books/books.msw"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { BookList } from "./book-list"

const listRouteStub = { path: "/books", component: () => null }

const buildBookItem = (title: string, authorNames: readonly string[]) => ({
  id: crypto.randomUUID(),
  title,
  authors: authorNames.map((name) => ({ id: crypto.randomUUID(), name })),
  version: 0,
})

const buildPagination = (total: number, totalPages: number) => ({
  page: 1,
  perPage: 10,
  total,
  totalPages,
})

describe("BookList", () => {
  it("API から取得した書籍と著者名を一覧表示する", async () => {
    server.use(
      getGetBooksMockHandler(
        getGetBooksResponseMock({
          items: [
            buildBookItem("書籍-1", ["著者-1", "著者-2"]),
            buildBookItem("書籍-2", ["著者-3"]),
          ],
          pagination: buildPagination(2, 1),
        }),
      ),
    )

    renderWithRouter(<BookList page={1} />, { routes: [listRouteStub] })

    expect(await screen.findByText("書籍-1")).toBeInTheDocument()
    expect(screen.getByText("著者-1、著者-2")).toBeInTheDocument()
    expect(screen.getByText("書籍-2")).toBeInTheDocument()
    expect(screen.getByText("著者-3")).toBeInTheDocument()
  })

  it("書籍が 0 件の場合は空状態メッセージを表示する", async () => {
    server.use(
      getGetBooksMockHandler(
        getGetBooksResponseMock({
          items: [],
          pagination: buildPagination(0, 0),
        }),
      ),
    )

    renderWithRouter(<BookList page={1} />, { routes: [listRouteStub] })

    expect(
      await screen.findByText("書籍が登録されていません"),
    ).toBeInTheDocument()
  })

  it("存在しないページを指定した場合は不存在メッセージを表示する", async () => {
    server.use(
      getGetBooksMockHandler(
        getGetBooksResponseMock({
          items: [],
          pagination: { page: 99, perPage: 10, total: 5, totalPages: 1 },
        }),
      ),
    )

    renderWithRouter(<BookList page={99} />, { routes: [listRouteStub] })

    expect(await screen.findByText("書籍が存在しません")).toBeInTheDocument()
  })

  it("2 ページ以上ある場合はページ番号のリンクを表示する", async () => {
    server.use(
      getGetBooksMockHandler(
        getGetBooksResponseMock({
          items: [buildBookItem("書籍-1", ["著者-1"])],
          pagination: buildPagination(11, 2),
        }),
      ),
    )

    renderWithRouter(<BookList page={1} />, { routes: [listRouteStub] })

    const pageTwo = await screen.findByRole("link", { name: "2" })
    expect(pageTwo).toHaveAttribute("href", "/books?page=2")
  })
})
