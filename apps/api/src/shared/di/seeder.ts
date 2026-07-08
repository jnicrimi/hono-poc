import { sql } from "drizzle-orm"
import { Author } from "../../modules/author/domain/author"
import type { AuthorId } from "../../modules/author/domain/author-id"
import { AuthorName } from "../../modules/author/domain/author-name"
import { DrizzleAuthorRepository } from "../../modules/author/infrastructure/drizzle-author-repository"
import { authors } from "../../modules/author/infrastructure/schema"
import { Book } from "../../modules/book/domain/book"
import { BookTitle } from "../../modules/book/domain/book-title"
import { DrizzleBookRepository } from "../../modules/book/infrastructure/drizzle-book-repository"
import { bookAuthors, books } from "../../modules/book/infrastructure/schema"
import type { Db } from "../db/client"

const AUTHOR_COUNT = 20
const BOOK_COUNT = 30
const MAX_AUTHORS_PER_BOOK = 3

export type SeedResult = {
  readonly authors: number
  readonly books: number
}

export const seedDatabase = async (db: Db): Promise<SeedResult> => {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`truncate table ${books}, ${authors}, ${bookAuthors} cascade`,
    )

    const authorRepository = new DrizzleAuthorRepository(tx)
    const bookRepository = new DrizzleBookRepository(tx)

    const authorIds: AuthorId[] = []
    for (let i = 0; i < AUTHOR_COUNT; i++) {
      const author = Author.create({
        name: AuthorName.from(`著者-${i + 1}`),
      })
      await authorRepository.insert(author)
      authorIds.push(author.id)
    }

    for (let i = 0; i < BOOK_COUNT; i++) {
      const start = i % AUTHOR_COUNT
      const rotated = [...authorIds.slice(start), ...authorIds.slice(0, start)]
      const book = Book.create({
        title: BookTitle.from(`書籍-${i + 1}`),
        authorIds: rotated.slice(0, (i % MAX_AUTHORS_PER_BOOK) + 1),
      })
      await bookRepository.insert(book)
    }
  })
  return { authors: AUTHOR_COUNT, books: BOOK_COUNT }
}
