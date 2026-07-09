import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  getGetAuthorsMockHandler,
  getGetAuthorsResponseMock,
} from "@/shared/api/generated/endpoints/authors/authors.msw"
import { server } from "@/shared/test-support/msw-server"
import { renderWithRouter } from "@/shared/test-support/render-with-router"
import { AuthorList } from "./author-list"

const editRouteStub = { path: "/authors/$authorId", component: () => null }
const listRouteStub = { path: "/authors", component: () => null }

const buildAuthorItem = (name: string) => ({
  id: crypto.randomUUID(),
  name,
  version: 0,
})

const buildPagination = (total: number, totalPages: number) => ({
  page: 1,
  perPage: 10,
  total,
  totalPages,
})

describe("AuthorList", () => {
  it("API から取得した著者を一覧表示する", async () => {
    server.use(
      getGetAuthorsMockHandler(
        getGetAuthorsResponseMock({
          items: [buildAuthorItem("著者-1"), buildAuthorItem("著者-2")],
          pagination: buildPagination(2, 1),
        }),
      ),
    )

    renderWithRouter(<AuthorList page={1} />, {
      routes: [editRouteStub, listRouteStub],
    })

    expect(await screen.findByText("著者-1")).toBeInTheDocument()
    expect(screen.getByText("著者-2")).toBeInTheDocument()
  })

  it("著者が 0 件の場合は空状態メッセージを表示する", async () => {
    server.use(
      getGetAuthorsMockHandler(
        getGetAuthorsResponseMock({
          items: [],
          pagination: buildPagination(0, 0),
        }),
      ),
    )

    renderWithRouter(<AuthorList page={1} />, {
      routes: [editRouteStub, listRouteStub],
    })

    expect(
      await screen.findByText("著者が登録されていません"),
    ).toBeInTheDocument()
  })

  it("存在しないページを指定した場合は不存在メッセージを表示する", async () => {
    server.use(
      getGetAuthorsMockHandler(
        getGetAuthorsResponseMock({
          items: [],
          pagination: { page: 99, perPage: 10, total: 5, totalPages: 1 },
        }),
      ),
    )

    renderWithRouter(<AuthorList page={99} />, {
      routes: [editRouteStub, listRouteStub],
    })

    expect(await screen.findByText("著者が存在しません")).toBeInTheDocument()
  })

  it("2 ページ以上ある場合はページ番号のリンクを表示する", async () => {
    server.use(
      getGetAuthorsMockHandler(
        getGetAuthorsResponseMock({
          items: [buildAuthorItem("著者-1")],
          pagination: buildPagination(11, 2),
        }),
      ),
    )

    renderWithRouter(<AuthorList page={1} />, {
      routes: [editRouteStub, listRouteStub],
    })

    const pageTwo = await screen.findByRole("link", { name: "2" })
    expect(pageTwo).toHaveAttribute("href", "/authors?page=2")
  })
})
