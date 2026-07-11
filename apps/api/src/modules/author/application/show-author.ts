import { AuthorId } from "../domain/author-id"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import type { AuthorReader, AuthorReadModel } from "./author-reader"

export type ShowAuthorQuery = { readonly id: string }
export type ShowAuthorResult = AuthorReadModel

export class ShowAuthor {
  constructor(private readonly reader: AuthorReader) {}

  async execute(query: ShowAuthorQuery): Promise<ShowAuthorResult> {
    const author = await this.reader.findById(AuthorId.restore(query.id))
    if (!author) {
      throw new AuthorNotFoundError()
    }
    return author
  }
}
