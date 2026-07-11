import type { AuthorExistenceReader } from "../../author/contract/application/author-existence-reader"
import { AuthorId } from "../../author/domain/author-id"
import { AuthorsNotAssignableError } from "../domain/authors-not-assignable-error"

export const resolveAssignableAuthorIds = async (
  reader: AuthorExistenceReader,
  values: readonly string[],
): Promise<readonly AuthorId[]> => {
  const authorIds = [...new Set(values)].map((value) => AuthorId.restore(value))
  const existing = new Set(
    (await reader.findExistingIds(authorIds)).map((id) => id.value),
  )
  if (authorIds.some((id) => !existing.has(id.value))) {
    throw new AuthorsNotAssignableError()
  }
  return authorIds
}
