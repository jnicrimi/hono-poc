import type { Author } from "./author"
import type { AuthorId } from "./author-id"

export interface AuthorRepository {
  findById(id: AuthorId): Promise<Author | null>
  insert(author: Author): Promise<void>
  update(author: Author, expectedVersion: number): Promise<Author>
  delete(id: AuthorId): Promise<void>
}
