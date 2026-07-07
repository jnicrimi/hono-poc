import { vi } from "vitest"
import type { BookRepository } from "../domain/book-repository"

export const createBookRepositoryStub = (
  overrides: Partial<BookRepository> = {},
): BookRepository => ({
  findById: vi.fn().mockResolvedValue(null),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  ...overrides,
})
