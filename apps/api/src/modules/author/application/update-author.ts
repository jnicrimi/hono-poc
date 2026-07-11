import { AuthorId } from "../domain/author-id"
import { AuthorName } from "../domain/author-name"
import { AuthorNotFoundError } from "../domain/author-not-found-error"
import type { AuthorRepository } from "../domain/author-repository"
import type { AuthorReader } from "./author-reader"

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
  constructor(
    private readonly repository: AuthorRepository,
    private readonly reader: AuthorReader,
  ) {}

  async execute(command: UpdateAuthorCommand): Promise<UpdateAuthorResult> {
    const existing = await this.repository.findById(
      AuthorId.restore(command.id),
    )
    if (!existing) {
      throw new AuthorNotFoundError()
    }
    const name = AuthorName.from(command.name)
    const saved = await this.repository.update(
      existing.update({ name }),
      command.version,
    )
    const updated = await this.reader.findById(saved.id)
    if (!updated) {
      throw new Error(`更新後の著者の取得に失敗しました: ${command.id}`)
    }
    return {
      id: updated.id,
      name: updated.name,
      version: updated.version,
    }
  }
}
