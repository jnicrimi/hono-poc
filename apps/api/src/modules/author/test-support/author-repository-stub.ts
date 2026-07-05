import { vi } from "vitest"
import type { AuthorRepository } from "../domain/author-repository"

export const createAuthorRepositoryStub = (
  overrides: Partial<AuthorRepository> = {},
): AuthorRepository => ({
  findById: vi.fn().mockResolvedValue(null),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  ...overrides,
})
