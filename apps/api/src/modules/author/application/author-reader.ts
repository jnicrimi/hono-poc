import type { AuthorId } from "../domain/author-id"

export type AuthorReadModel = {
  readonly id: string
  readonly name: string
  readonly version: number
}

export interface AuthorReader {
  findById(id: AuthorId): Promise<AuthorReadModel | null>
  findMany(params: {
    readonly limit: number
    readonly offset: number
  }): Promise<{
    readonly items: readonly AuthorReadModel[]
    readonly total: number
  }>
}
