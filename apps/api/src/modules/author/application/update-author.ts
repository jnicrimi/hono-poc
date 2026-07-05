import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import type { AuthorRepository } from "../domain/author-repository"

export type UpdateAuthorCommand = {
  readonly id: string
  readonly name: string
  readonly version: number
}

export type UpdateAuthorResult = {
  readonly id: string
  readonly name: string
  readonly version: number
}

export class UpdateAuthor {
  constructor(private readonly repository: AuthorRepository) {}

  async execute(command: UpdateAuthorCommand): Promise<UpdateAuthorResult> {
    const existing = await this.repository.findById(
      AuthorId.restore(command.id),
    )
    if (!existing) {
      throw new AuthorNotFoundError(command.id)
    }
    const name = AuthorName.from(command.name)
    const saved = await this.repository.update(
      existing.update({ name }),
      command.version,
    )
    return {
      id: saved.id.value,
      name: saved.name.value,
      version: saved.version,
    }
  }
}
