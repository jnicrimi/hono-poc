import { setupServer } from "msw/node"
import { getAuthorsMock } from "@/shared/api/generated/endpoints/authors/authors.msw"
import { getBooksMock } from "@/shared/api/generated/endpoints/books/books.msw"

export const server = setupServer(...getAuthorsMock(), ...getBooksMock())
