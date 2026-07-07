import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
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
