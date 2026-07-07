import { vi } from "vitest"
import type { BookReader } from "../application/book-reader"

export const createBookReaderStub = (
  overrides: Partial<BookReader> = {},
): BookReader => ({
  findById: vi.fn().mockResolvedValue(null),
  findMany: vi.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
  ...overrides,
})
