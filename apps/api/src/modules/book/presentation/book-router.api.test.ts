import { validate as uuidValidate } from "uuid"
import { describe, expect, it, vi } from "vitest"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import {
  UPPERCASE_UUID_V7,
  VALID_UUID_V7,
} from "../../../shared/test-support/uuid-test-data"
import { createAuthorExistenceReaderStub } from "../../author/contract/test-support/author-existence-reader-stub"
import { BOOK_MAX_AUTHOR_IDS } from "../domain/book"
import { buildBook } from "../test-support/book-builder"
import { createBookReaderStub } from "../test-support/book-reader-stub"
import { createBookRepositoryStub } from "../test-support/book-repository-stub"
import { createBookTestApp } from "../test-support/create-book-test-app"

const jsonRequest = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
})

const createTestApp = (
  overrides: Partial<Parameters<typeof createBookTestApp>[0]> = {},
) =>
  createBookTestApp({
    repository: createBookRepositoryStub(),
    reader: createBookReaderStub(),
    authorReader: createAuthorExistenceReaderStub(),
    ...overrides,
  })

describe("POST /books", () => {
  it("201 と採番した id を返す", async () => {
    const repository = createBookRepositoryStub()
    const app = createTestApp({ repository })
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: [VALID_UUID_V7],
      }),
    )
    expect(res.status).toBe(201)
    const body = (await res.json()) as { id: string }
    expect(uuidValidate(body.id)).toBe(true)
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        title: expect.objectContaining({ value: "書籍タイトル" }),
        authorIds: [expect.objectContaining({ value: VALID_UUID_V7 })],
      }),
    )
  })

  it("存在しない著者を指定した場合は 400 とエラーレスポンスを返す", async () => {
    const app = createTestApp({
      authorReader: createAuthorExistenceReaderStub({
        findExistingIds: vi.fn().mockResolvedValue([]),
      }),
    })
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: [VALID_UUID_V7],
      }),
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      errors: [{ message: "存在しない著者が指定されています" }],
    })
  })

  it("title が空の場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", { title: "", authorIds: [VALID_UUID_V7] }),
    )
    expect(res.status).toBe(422)
  })

  it("authorIds が空の場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", { title: "書籍タイトル", authorIds: [] }),
    )
    expect(res.status).toBe(422)
  })

  it("authorIds を省略した場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", { title: "書籍タイトル" }),
    )
    expect(res.status).toBe(422)
  })

  it("authorIds に uuid でない値がある場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: ["not-a-uuid"],
      }),
    )
    expect(res.status).toBe(422)
  })

  it("authorIds に大文字の id がある場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: [UPPERCASE_UUID_V7],
      }),
    )
    expect(res.status).toBe(422)
  })

  it("authorIds が上限を超えた場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: Array.from({ length: BOOK_MAX_AUTHOR_IDS + 1 }, () =>
          crypto.randomUUID(),
        ),
      }),
    )
    expect(res.status).toBe(422)
  })

  it("content-type が JSON でない場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({
        title: "書籍タイトル",
        authorIds: [VALID_UUID_V7],
      }),
    })
    expect(res.status).toBe(422)
  })
})

describe("GET /books", () => {
  it("200 と items + pagination を返す", async () => {
    const items = [
      { id: VALID_UUID_V7, title: "書籍タイトル", authors: [], version: 0 },
    ]
    const reader = createBookReaderStub({
      findMany: vi.fn().mockResolvedValue({ items, total: 1 }),
    })
    const app = createTestApp({ reader })
    const res = await app.request("/books")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      items,
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
  })

  it("query 未指定の場合はデフォルトの limit と offset が reader に届く", async () => {
    const reader = createBookReaderStub()
    const app = createTestApp({ reader })
    await app.request("/books")
    expect(reader.findMany).toHaveBeenCalledWith({ limit: 10, offset: 0 })
  })

  it("page が 0 の場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books?page=0")
    expect(res.status).toBe(400)
  })

  it("page が数値でない場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books?page=abc")
    expect(res.status).toBe(400)
  })

  it("perPage が上限を超えた場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books?perPage=101")
    expect(res.status).toBe(400)
  })
})

describe("GET /books/{id}", () => {
  it("200 と書籍を返す", async () => {
    const readModel = {
      id: VALID_UUID_V7,
      title: "書籍タイトル",
      authors: [{ id: crypto.randomUUID(), name: "著者名" }],
      version: 0,
    }
    const reader = createBookReaderStub({
      findById: vi.fn().mockResolvedValue(readModel),
    })
    const app = createTestApp({ reader })
    const res = await app.request(`/books/${VALID_UUID_V7}`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(readModel)
  })

  it("存在しない場合は 404 とエラーレスポンスを返す", async () => {
    const app = createTestApp()
    const res = await app.request(`/books/${VALID_UUID_V7}`)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({
      errors: [{ message: "書籍が見つかりません" }],
    })
  })

  it("id が uuid でない場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books/not-a-uuid")
    expect(res.status).toBe(400)
  })

  it("id が大文字の場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(`/books/${UPPERCASE_UUID_V7}`)
    expect(res.status).toBe(400)
  })
})

describe("PATCH /books/{id}", () => {
  it("200 と更新後の書籍を返す", async () => {
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildBook({ id: VALID_UUID_V7 })),
      update: vi.fn().mockResolvedValue(
        buildBook({
          id: VALID_UUID_V7,
          title: "更新後の書籍タイトル",
          version: 1,
        }),
      ),
    })
    const reader = createBookReaderStub({
      findById: vi.fn().mockResolvedValue({
        id: VALID_UUID_V7,
        title: "更新後の書籍タイトル",
        authors: [{ id: VALID_UUID_V7, name: "著者名" }],
        version: 1,
      }),
    })
    const app = createTestApp({ repository, reader })
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", {
        title: "更新後の書籍タイトル",
        authorIds: [VALID_UUID_V7],
        version: 0,
      }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      id: VALID_UUID_V7,
      title: "更新後の書籍タイトル",
      authors: [{ id: VALID_UUID_V7, name: "著者名" }],
      version: 1,
    })
  })

  it("存在しない著者を指定した場合は 400 を返す", async () => {
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildBook({ id: VALID_UUID_V7 })),
    })
    const app = createTestApp({
      repository,
      authorReader: createAuthorExistenceReaderStub({
        findExistingIds: vi.fn().mockResolvedValue([]),
      }),
    })
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", {
        title: "更新後の書籍タイトル",
        authorIds: [VALID_UUID_V7],
        version: 0,
      }),
    )
    expect(res.status).toBe(400)
  })

  it("存在しない場合は 404 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", {
        title: "更新後の書籍タイトル",
        authorIds: [VALID_UUID_V7],
        version: 0,
      }),
    )
    expect(res.status).toBe(404)
  })

  it("version が競合した場合は 409 とエラーレスポンスを返す", async () => {
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildBook({ id: VALID_UUID_V7 })),
      update: vi
        .fn()
        .mockRejectedValue(new OptimisticLockError("book", VALID_UUID_V7)),
    })
    const app = createTestApp({ repository })
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", {
        title: "更新後の書籍タイトル",
        authorIds: [VALID_UUID_V7],
        version: 0,
      }),
    )
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({
      errors: [{ message: "書籍は他の操作によって更新されています" }],
    })
  })

  it("authorIds を省略した場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", { title: "更新後の書籍タイトル", version: 0 }),
    )
    expect(res.status).toBe(422)
  })

  it("version が負の場合は 422 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(
      `/books/${VALID_UUID_V7}`,
      jsonRequest("PATCH", {
        title: "更新後の書籍タイトル",
        authorIds: [VALID_UUID_V7],
        version: -1,
      }),
    )
    expect(res.status).toBe(422)
  })
})

describe("DELETE /books/{id}", () => {
  it("204 を返し書籍を削除する", async () => {
    const repository = createBookRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildBook({ id: VALID_UUID_V7 })),
    })
    const app = createTestApp({ repository })
    const res = await app.request(`/books/${VALID_UUID_V7}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(204)
    expect(repository.delete).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: VALID_UUID_V7 }),
    )
  })

  it("存在しない場合は 404 を返す", async () => {
    const app = createTestApp()
    const res = await app.request(`/books/${VALID_UUID_V7}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(404)
  })

  it("id が uuid でない場合は 400 を返す", async () => {
    const app = createTestApp()
    const res = await app.request("/books/not-a-uuid", { method: "DELETE" })
    expect(res.status).toBe(400)
  })
})

describe("想定外のエラー", () => {
  it("500 とサーバーエラーのレスポンスを返す", async () => {
    const repository = createBookRepositoryStub({
      insert: vi.fn().mockRejectedValue(new Error("boom")),
    })
    const app = createTestApp({ repository })
    const res = await app.request(
      "/books",
      jsonRequest("POST", {
        title: "書籍タイトル",
        authorIds: [VALID_UUID_V7],
      }),
    )
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      errors: [{ message: "サーバーエラーが発生しました" }],
    })
  })
})
