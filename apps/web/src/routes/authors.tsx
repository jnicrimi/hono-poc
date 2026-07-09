import { createFileRoute } from "@tanstack/react-router"
import { AuthorsPage } from "./-authors-page"

export const Route = createFileRoute("/authors")({
  component: AuthorsPage,
})
