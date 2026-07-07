import { z } from "@hono/zod-openapi"
import { validationMessages } from "../../../shared/error/validation-messages"
import { bookFieldLabels } from "../domain/book-field-labels"

export const bookIdParamSchema = z.object({
  id: z.uuid(validationMessages.invalidValue(bookFieldLabels.id)).openapi({
    description: "書籍ID",
    param: { name: "id", in: "path" },
    example: "01920000-0000-7000-8000-000000000001",
  }),
})
