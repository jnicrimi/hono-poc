import { Author } from "../domain/author"
import { AuthorName } from "../domain/author-name"
import type { AuthorRepository } from "../domain/author-repository"

export type CreateAuthorCommand = {
  readonly name: string
}

export type CreateAuthorResult = {
  readonly id: string
}

export class CreateAuthor {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: CreateAuthorCommand): Promise<CreateAuthorResult> {
    const author = Author.create({ name: AuthorName.from(command.name) })
    await this.repository.insert(author)
    return { id: author.id.value }
  }
}
