import { z } from "@hono/zod-openapi"
import { validationMessages } from "../../../shared/error/validation-messages"
import { BOOK_MAX_AUTHOR_IDS } from "../domain/book"
import { bookFieldLabels } from "../domain/book-field-labels"
import { BOOK_TITLE_MAX_LENGTH } from "../domain/book-title"

const titleRequired = validationMessages.required(bookFieldLabels.title)
const authorIdInvalid = validationMessages.invalidValue(
  bookFieldLabels.authorId,
)
const versionInvalid = validationMessages.nonNegativeInteger(
  bookFieldLabels.version,
)

export const updateBookSchema = z.object({
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
  authorIds: z
    .array(z.uuid(authorIdInvalid))
    .min(1, validationMessages.minCount(bookFieldLabels.authorId, 1))
    .max(
      BOOK_MAX_AUTHOR_IDS,
      validationMessages.maxCount(
        bookFieldLabels.authorId,
        BOOK_MAX_AUTHOR_IDS,
      ),
    )
    .openapi({ description: "著者IDの一覧" }),
  version: z
    .number(versionInvalid)
    .int(versionInvalid)
    .min(0, versionInvalid)
    .openapi({ description: "バージョン" }),
})
