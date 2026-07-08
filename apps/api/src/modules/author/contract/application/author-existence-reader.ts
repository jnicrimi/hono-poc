import type { AuthorId } from "../../domain/author-id"

export interface AuthorExistenceReader {
  findExistingIds(ids: readonly AuthorId[]): Promise<readonly AuthorId[]>
}
