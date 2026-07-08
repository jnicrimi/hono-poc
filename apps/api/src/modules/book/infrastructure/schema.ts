import {
  index,
  integer,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { authors } from "../../author/infrastructure/schema"
import { BOOK_TITLE_MAX_LENGTH } from "../domain/book-title"

export const books = pgTable("books", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: BOOK_TITLE_MAX_LENGTH }).notNull(),
  version: integer("version").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const bookAuthors = pgTable(
  "book_authors",
  {
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "restrict" }),
  },
  (table) => [
    primaryKey({ columns: [table.bookId, table.authorId] }),
    index("book_authors_author_id_index").on(table.authorId),
  ],
)
