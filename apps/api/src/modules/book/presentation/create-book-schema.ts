import { z } from "@hono/zod-openapi"
import { validationMessages } from "../../../shared/error/validation-messages"
import { bookFieldLabels } from "../domain/book-field-labels"
import { BOOK_TITLE_MAX_LENGTH } from "../domain/book-title"

const titleRequired = validationMessages.required(bookFieldLabels.title)

export const createBookSchema = z.object({
  title: z
    .string(titleRequired)
    .trim()
    .min(1, titleRequired)
    .max(
      BOOK_TITLE_MAX_LENGTH,
      validationMessages.maxLength(
        bookFieldLabels.title,
        BOOK_TITLE_MAX_LENGTH,
      ),
    )
    .openapi({ description: "書籍タイトル" }),
})
