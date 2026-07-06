import { VALID_UUID_V7 } from "../../../shared/test-support/uuid-test-data"
import { Author } from "../domain/author"
import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"

type BuildAuthorOverrides = {
  readonly id?: string
  readonly name?: string
  readonly version?: number
}

export const buildAuthor = (overrides: BuildAuthorOverrides = {}): Author =>
  Author.reconstruct({
    id: AuthorId.restore(overrides.id ?? VALID_UUID_V7),
    name: AuthorName.from(overrides.name ?? "著者名"),
    version: overrides.version ?? 0,
  })
