import { validate as uuidValidate } from "uuid"
import { describe, expect, it, vi } from "vitest"
import { OptimisticLockError } from "../../../shared/error/optimistic-lock-error"
import {
  UPPERCASE_UUID_V7,
  VALID_UUID_V7,
} from "../../../shared/test-support/uuid-test-data"
import { AuthorInUseError } from "../domain/author-in-use-error"
import { buildAuthor } from "../test-support/author-builder"
import { createAuthorReaderStub } from "../test-support/author-reader-stub"
import { createAuthorRepositoryStub } from "../test-support/author-repository-stub"
import { createAuthorTestApp } from "../test-support/create-author-test-app"

const jsonRequest = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
})

describe("POST /authors", () => {
  it("201 と採番した id を返す", async () => {
    const repository = createAuthorRepositoryStub()
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      "/authors",
      jsonRequest("POST", { name: "著者名" }),
    )
    expect(res.status).toBe(201)
    const body = (await res.json()) as { id: string }
    expect(uuidValidate(body.id)).toBe(true)
    expect(repository.insert).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        name: expect.objectContaining({ value: "著者名" }),
      }),
    )
  })

  it("name が空の場合は 422 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors", jsonRequest("POST", { name: "" }))
    expect(res.status).toBe(422)
  })

  it("content-type が JSON でない場合は 422 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ name: "著者名" }),
    })
    expect(res.status).toBe(422)
  })
})

describe("GET /authors", () => {
  it("200 と items + pagination を返す", async () => {
    const items = [{ id: VALID_UUID_V7, name: "著者名", version: 0 }]
    const reader = createAuthorReaderStub({
      findMany: vi.fn().mockResolvedValue({ items, total: 1 }),
    })
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader,
    })
    const res = await app.request("/authors")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      items,
      pagination: { page: 1, perPage: 10, total: 1, totalPages: 1 },
    })
  })

  it("query 未指定の場合はデフォルトの limit と offset が reader に届く", async () => {
    const reader = createAuthorReaderStub()
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader,
    })
    await app.request("/authors")
    expect(reader.findMany).toHaveBeenCalledWith({ limit: 10, offset: 0 })
  })

  it("page が 0 の場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors?page=0")
    expect(res.status).toBe(400)
  })

  it("page が数値でない場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors?page=abc")
    expect(res.status).toBe(400)
  })

  it("perPage が上限を超えた場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors?perPage=101")
    expect(res.status).toBe(400)
  })
})

describe("GET /authors/{id}", () => {
  it("200 と著者を返す", async () => {
    const readModel = { id: VALID_UUID_V7, name: "著者名", version: 0 }
    const reader = createAuthorReaderStub({
      findById: vi.fn().mockResolvedValue(readModel),
    })
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader,
    })
    const res = await app.request(`/authors/${VALID_UUID_V7}`)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(readModel)
  })

  it("存在しない場合は 404 とエラー封筒を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(`/authors/${VALID_UUID_V7}`)
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({
      errors: [{ message: "著者が見つかりません" }],
    })
  })

  it("id が uuid でない場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors/not-a-uuid")
    expect(res.status).toBe(400)
  })

  it("id が大文字の場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(`/authors/${UPPERCASE_UUID_V7}`)
    expect(res.status).toBe(400)
  })
})

describe("PATCH /authors/{id}", () => {
  it("200 と更新後の著者を返す", async () => {
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildAuthor({ id: VALID_UUID_V7 })),
      update: vi.fn().mockResolvedValue(
        buildAuthor({
          id: VALID_UUID_V7,
          name: "更新後の著者名",
          version: 1,
        }),
      ),
    })
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      `/authors/${VALID_UUID_V7}`,
      jsonRequest("PATCH", { name: "更新後の著者名", version: 0 }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      id: VALID_UUID_V7,
      name: "更新後の著者名",
      version: 1,
    })
  })

  it("存在しない場合は 404 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      `/authors/${VALID_UUID_V7}`,
      jsonRequest("PATCH", { name: "更新後の著者名", version: 0 }),
    )
    expect(res.status).toBe(404)
  })

  it("version が競合した場合は 409 とエラー封筒を返す", async () => {
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildAuthor({ id: VALID_UUID_V7 })),
      update: vi
        .fn()
        .mockRejectedValue(new OptimisticLockError("author", VALID_UUID_V7)),
    })
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      `/authors/${VALID_UUID_V7}`,
      jsonRequest("PATCH", { name: "更新後の著者名", version: 0 }),
    )
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({
      errors: [{ message: "著者は他の操作によって更新されています" }],
    })
  })

  it("version が負の場合は 422 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      `/authors/${VALID_UUID_V7}`,
      jsonRequest("PATCH", { name: "更新後の著者名", version: -1 }),
    )
    expect(res.status).toBe(422)
  })
})

describe("DELETE /authors/{id}", () => {
  it("204 を返し著者を削除する", async () => {
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildAuthor({ id: VALID_UUID_V7 })),
    })
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(`/authors/${VALID_UUID_V7}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(204)
    expect(repository.delete).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ value: VALID_UUID_V7 }),
    )
  })

  it("存在しない場合は 404 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(`/authors/${VALID_UUID_V7}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(404)
  })

  it("id が uuid でない場合は 400 を返す", async () => {
    const app = createAuthorTestApp({
      repository: createAuthorRepositoryStub(),
      reader: createAuthorReaderStub(),
    })
    const res = await app.request("/authors/not-a-uuid", { method: "DELETE" })
    expect(res.status).toBe(400)
  })

  it("書籍に割り当てられている場合は 409 とエラー封筒を返す", async () => {
    const repository = createAuthorRepositoryStub({
      findById: vi.fn().mockResolvedValue(buildAuthor({ id: VALID_UUID_V7 })),
      delete: vi.fn().mockRejectedValue(new AuthorInUseError(VALID_UUID_V7)),
    })
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(`/authors/${VALID_UUID_V7}`, {
      method: "DELETE",
    })
    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({
      errors: [{ message: "書籍に割り当てられている著者は削除できません" }],
    })
  })
})

describe("想定外のエラー", () => {
  it("500 とサーバーエラーの封筒を返す", async () => {
    const repository = createAuthorRepositoryStub({
      insert: vi.fn().mockRejectedValue(new Error("boom")),
    })
    const app = createAuthorTestApp({
      repository,
      reader: createAuthorReaderStub(),
    })
    const res = await app.request(
      "/authors",
      jsonRequest("POST", { name: "著者名" }),
    )
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      errors: [{ message: "サーバーエラーが発生しました" }],
    })
  })
})
