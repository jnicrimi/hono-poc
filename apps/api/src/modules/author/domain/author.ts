import { AuthorId } from "./author-id"
import type { AuthorName } from "./author-name"

type AuthorProps = {
  readonly id: AuthorId
  readonly name: AuthorName
  readonly version: number
}

type AuthorCreateParams = {
  readonly name: AuthorName
}

type AuthorUpdateParams = {
  readonly name: AuthorName
}

export class Author {
  readonly id: AuthorId
  readonly name: AuthorName
  readonly version: number

  private constructor({ id, name, version }: AuthorProps) {
    this.id = id
    this.name = name
    this.version = version
  }

  static create({ name }: AuthorCreateParams): Author {
    return new Author({
      id: AuthorId.generate(),
      name,
      version: 0,
    })
  }

  static reconstruct(props: AuthorProps): Author {
    return new Author(props)
  }

  update({ name }: AuthorUpdateParams): Author {
    return new Author({ ...this, name })
  }
}
