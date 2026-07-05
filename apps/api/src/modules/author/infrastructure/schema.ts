import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { AUTHOR_NAME_MAX_LENGTH } from "../domain/author-name"

export const authors = pgTable("authors", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: AUTHOR_NAME_MAX_LENGTH }).notNull(),
  version: integer("version").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
