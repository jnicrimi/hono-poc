import { createFileRoute } from "@tanstack/react-router"
import { BooksPage } from "./-books-page"

export const Route = createFileRoute("/books")({
  component: BooksPage,
})
