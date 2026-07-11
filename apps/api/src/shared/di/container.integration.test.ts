import { describe, expect, it } from "vitest"
import type { Db } from "../db/client"
import { runInRollback } from "../db/test-support/test-db"
import { createHttpBoundaryConfigStub } from "../http/test-support/http-boundary-config-stub"
import { createLoggerStub } from "../logger/test-support/logger-stub"
import { createApp } from "./container"

const createTestApp = (db: Db) =>
  createApp(db, createLoggerStub(), {
    enableApiDocs: false,
    cors: { allowedOrigins: [] },
    httpBoundary: createHttpBoundaryConfigStub(),
  })

const jsonRequest = (method: string, body: unknown) => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
})

describe("createApp", () => {
  it("著者の CRUD が実配線で動作する", () =>
    runInRollback(async (tx) => {
      const app = createTestApp(tx)

      const createRes = await app.request(
        "/authors",
        jsonRequest("POST", { name: "著者名" }),
      )
      expect(createRes.status).toBe(201)
      const created = (await createRes.json()) as {
        id: string
        name: string
        version: number
      }
      expect(created).toEqual({ id: created.id, name: "著者名", version: 0 })

      const listRes = await app.request("/authors")
      expect(listRes.status).toBe(200)
      const list = (await listRes.json()) as {
        items: readonly { id: string }[]
      }
      expect(list.items.map((item) => item.id)).toContain(created.id)

      const showRes = await app.request(`/authors/${created.id}`)
      expect(showRes.status).toBe(200)
      expect(await showRes.json()).toEqual(created)

      const updateRes = await app.request(
        `/authors/${created.id}`,
        jsonRequest("PATCH", { name: "更新後の著者名", version: 0 }),
      )
      expect(updateRes.status).toBe(200)
      expect(await updateRes.json()).toEqual({
        id: created.id,
        name: "更新後の著者名",
        version: 1,
      })

      const deleteRes = await app.request(`/authors/${created.id}`, {
        method: "DELETE",
      })
      expect(deleteRes.status).toBe(204)
      const showAfterDelete = await app.request(`/authors/${created.id}`)
      expect(showAfterDelete.status).toBe(404)
    }))

  it("書籍の CRUD が実配線で動作する", () =>
    runInRollback(async (tx) => {
      const app = createTestApp(tx)

      const authorRes = await app.request(
        "/authors",
        jsonRequest("POST", { name: "著者名" }),
      )
      const author = (await authorRes.json()) as { id: string }

      const createRes = await app.request(
        "/books",
        jsonRequest("POST", { title: "書籍タイトル", authorIds: [author.id] }),
      )
      expect(createRes.status).toBe(201)
      const created = (await createRes.json()) as { id: string }
      expect(created).toEqual({
        id: created.id,
        title: "書籍タイトル",
        authors: [{ id: author.id, name: "著者名" }],
        version: 0,
      })

      const showRes = await app.request(`/books/${created.id}`)
      expect(showRes.status).toBe(200)
      expect(await showRes.json()).toEqual({
        id: created.id,
        title: "書籍タイトル",
        authors: [{ id: author.id, name: "著者名" }],
        version: 0,
      })

      const updateRes = await app.request(
        `/books/${created.id}`,
        jsonRequest("PATCH", {
          title: "更新後の書籍タイトル",
          authorIds: [author.id],
          version: 0,
        }),
      )
      expect(updateRes.status).toBe(200)
      expect(await updateRes.json()).toEqual({
        id: created.id,
        title: "更新後の書籍タイトル",
        authors: [{ id: author.id, name: "著者名" }],
        version: 1,
      })

      const deleteRes = await app.request(`/books/${created.id}`, {
        method: "DELETE",
      })
      expect(deleteRes.status).toBe(204)
      const showAfterDelete = await app.request(`/books/${created.id}`)
      expect(showAfterDelete.status).toBe(404)
    }))
})
