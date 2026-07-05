import { AuthorId } from "../domain/author-id"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import type { AuthorReader, AuthorReadModel } from "./author-reader"

export type GetAuthorByIdQuery = { readonly id: string }
export type GetAuthorByIdResult = AuthorReadModel

export class GetAuthorById {
  constructor(private readonly reader: AuthorReader) {}

  async execute(query: GetAuthorByIdQuery): Promise<GetAuthorByIdResult> {
    const author = await this.reader.findById(AuthorId.restore(query.id))
    if (!author) {
      throw new AuthorNotFoundError(query.id)
    }
    return author
  }
}
