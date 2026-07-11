import { Author } from "../domain/author"
import { AuthorName } from "../domain/author-name"
import type { AuthorRepository } from "../domain/author-repository"
import type { AuthorReader } from "./author-reader"

export type CreateAuthorCommand = {
  readonly name: string
}

export type CreateAuthorResult = {
  readonly id: string
  readonly name: string
  readonly version: number
}

export class CreateAuthor {
  constructor(
    private readonly repository: AuthorRepository,
    private readonly reader: AuthorReader,
  ) {}

  async execute(command: CreateAuthorCommand): Promise<CreateAuthorResult> {
    const author = Author.create({ name: AuthorName.from(command.name) })
    await this.repository.insert(author)
    const created = await this.reader.findById(author.id)
    if (!created) {
      throw new Error(`作成後の著者の取得に失敗しました: ${author.id.value}`)
    }
    return {
      id: created.id,
      name: created.name,
      version: created.version,
    }
  }
}
