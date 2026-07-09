import { HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { server } from "@/shared/test-support/msw-server"
import { ApiError } from "./api-error"
import { customFetch } from "./fetch-mutator"

const BASE_URL = "http://localhost:3000"

describe("customFetch", () => {
  it("成功レスポンスの場合は JSON ボディを返す", async () => {
    server.use(
      http.get(`${BASE_URL}/items`, () => HttpResponse.json({ ok: true })),
    )
    await expect(customFetch("/items", { method: "GET" })).resolves.toEqual({
      ok: true,
    })
  })

  it("204 の場合は undefined を返す", async () => {
    server.use(
      http.delete(
        `${BASE_URL}/items/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    )
    await expect(
      customFetch("/items/1", { method: "DELETE" }),
    ).resolves.toBeUndefined()
  })

  it("エラーレスポンスの場合は status と errors を持つ ApiError を投げる", async () => {
    server.use(
      http.get(`${BASE_URL}/items`, () =>
        HttpResponse.json(
          { errors: [{ message: "見つかりません" }] },
          { status: 404 },
        ),
      ),
    )
    const error: unknown = await customFetch("/items", { method: "GET" }).catch(
      (caught: unknown) => caught,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 404,
      errors: [{ message: "見つかりません" }],
    })
  })

  it("エラーボディが想定形式でない場合は既定メッセージの ApiError を投げる", async () => {
    server.use(
      http.get(`${BASE_URL}/items`, () =>
        HttpResponse.json({ reason: "broken" }, { status: 500 }),
      ),
    )
    const error: unknown = await customFetch("/items", { method: "GET" }).catch(
      (caught: unknown) => caught,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 500,
      errors: [{ message: "予期しないエラーが発生しました" }],
    })
  })

  it("ネットワークエラーの場合は status 0 と cause を持つ ApiError を投げる", async () => {
    server.use(http.get(`${BASE_URL}/items`, () => HttpResponse.error()))
    const error: unknown = await customFetch("/items", { method: "GET" }).catch(
      (caught: unknown) => caught,
    )
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 0,
      errors: [{ message: "ネットワークエラーが発生しました" }],
    })
    expect((error as ApiError).cause).toBeDefined()
  })
})
