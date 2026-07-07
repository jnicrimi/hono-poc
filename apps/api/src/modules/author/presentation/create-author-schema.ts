import { z } from "@hono/zod-openapi"
import { validationMessages } from "../../../shared/error/validation-messages"
import { authorFieldLabels } from "../domain/author-field-labels"
import { AUTHOR_NAME_MAX_LENGTH } from "../domain/author-name"

const nameRequired = validationMessages.required(authorFieldLabels.name)

export const createAuthorSchema = z.object({
  name: z
    .string(nameRequired)
    .trim()
    .min(1, nameRequired)
    .max(
      AUTHOR_NAME_MAX_LENGTH,
      validationMessages.maxLength(
        authorFieldLabels.name,
        AUTHOR_NAME_MAX_LENGTH,
      ),
    )
    .openapi({ description: "著者名" }),
})
