import { vi } from "vitest"
import type { AuthorId } from "../../domain/author-id"
import type { AuthorExistenceReader } from "../application/author-existence-reader"

export const createAuthorExistenceReaderStub = (
  overrides: Partial<AuthorExistenceReader> = {},
): AuthorExistenceReader => ({
  findExistingIds: vi
    .fn()
    .mockImplementation((ids: readonly AuthorId[]) => Promise.resolve(ids)),
  ...overrides,
})
