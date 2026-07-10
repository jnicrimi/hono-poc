import type { APIRequestContext } from "@playwright/test"
import { apiUrl } from "./servers"

const listPerPage = 10

type ListItem = { readonly id: string }
type ListResponse = {
  readonly items: readonly ListItem[]
}

const ensureOk = async (
  response: Awaited<ReturnType<APIRequestContext["get"]>>,
  operation: string,
) => {
  if (!response.ok()) {
    throw new Error(`${operation} failed: ${response.status()}`)
  }
  return response
}

export const uniqueName = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`

export const createAuthor = async (
  request: APIRequestContext,
  name: string,
) => {
  const response = await ensureOk(
    await request.post(`${apiUrl}/authors`, { data: { name } }),
    "create author",
  )
  const body = (await response.json()) as { id: string }
  return body.id
}

export const getAuthorVersion = async (
  request: APIRequestContext,
  id: string,
) => {
  const response = await ensureOk(
    await request.get(`${apiUrl}/authors/${id}`),
    "get author",
  )
  const body = (await response.json()) as { version: number }
  return body.version
}

export const updateAuthor = async (
  request: APIRequestContext,
  id: string,
  data: { name: string; version: number },
) => {
  await ensureOk(
    await request.patch(`${apiUrl}/authors/${id}`, { data }),
    "update author",
  )
}

export const deleteAuthor = async (request: APIRequestContext, id: string) => {
  await ensureOk(
    await request.delete(`${apiUrl}/authors/${id}`),
    "delete author",
  )
}

export const findAuthorIdByName = async (
  request: APIRequestContext,
  name: string,
) => findIdByName(request, "authors", name)

export const createBook = async (
  request: APIRequestContext,
  data: { title: string; authorIds: readonly string[] },
) => {
  const response = await ensureOk(
    await request.post(`${apiUrl}/books`, { data }),
    "create book",
  )
  const body = (await response.json()) as { id: string }
  return body.id
}

export const getBookVersion = async (
  request: APIRequestContext,
  id: string,
) => {
  const response = await ensureOk(
    await request.get(`${apiUrl}/books/${id}`),
    "get book",
  )
  const body = (await response.json()) as { version: number }
  return body.version
}

export const updateBook = async (
  request: APIRequestContext,
  id: string,
  data: { title: string; authorIds: readonly string[]; version: number },
) => {
  await ensureOk(
    await request.patch(`${apiUrl}/books/${id}`, { data }),
    "update book",
  )
}

export const deleteBook = async (request: APIRequestContext, id: string) => {
  await ensureOk(await request.delete(`${apiUrl}/books/${id}`), "delete book")
}

export const findBookIdByName = async (
  request: APIRequestContext,
  title: string,
) => findIdByName(request, "books", title)

export const resolveListPage = async (
  request: APIRequestContext,
  resource: "authors" | "books",
  id: string,
) => {
  const items = await fetchAllItems(request, resource)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error(`${resource} not found in list: ${id}`)
  }
  return Math.floor(index / listPerPage) + 1
}

const fetchAllItems = async (
  request: APIRequestContext,
  resource: "authors" | "books",
) => {
  const response = await ensureOk(
    await request.get(`${apiUrl}/${resource}?perPage=100`),
    `list ${resource}`,
  )
  const body = (await response.json()) as ListResponse
  return body.items
}

const findIdByName = async (
  request: APIRequestContext,
  resource: "authors" | "books",
  name: string,
) => {
  const items = (await fetchAllItems(request, resource)) as readonly {
    id: string
    name?: string
    title?: string
  }[]
  const found = items.find((item) => (item.name ?? item.title) === name)
  if (!found) {
    throw new Error(`${resource} not found by name: ${name}`)
  }
  return found.id
}
