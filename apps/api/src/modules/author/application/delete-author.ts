import { AuthorId } from "../domain/author-id"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import type { AuthorRepository } from "../domain/author-repository"

export type DeleteAuthorCommand = {
  readonly id: string
}

export class DeleteAuthor {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: DeleteAuthorCommand): Promise<void> {
    const authorId = AuthorId.restore(command.id)
    const existing = await this.repository.findById(authorId)
    if (!existing) {
      throw new AuthorNotFoundError(command.id)
    }
    await this.repository.delete(authorId)
  }
}
