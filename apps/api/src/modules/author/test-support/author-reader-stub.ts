import { vi } from "vitest"
import type { AuthorReader } from "../application/author-reader"

export const createAuthorReaderStub = (
  overrides: Partial<AuthorReader> = {},
): AuthorReader => ({
  findById: vi.fn().mockResolvedValue(null),
  findMany: vi.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
  ...overrides,
})
