import { z } from "@hono/zod-openapi"
import { validationMessages } from "../../../shared/error/validation-messages"
import { createLowercaseUuidSchema } from "../../../shared/openapi/create-lowercase-uuid-schema"
import { authorFieldLabels } from "../domain/author-field-labels"

export const authorIdParamSchema = z.object({
  id: createLowercaseUuidSchema(
    validationMessages.invalidValue(authorFieldLabels.id),
  ).openapi({
    description: "著者ID",
    param: { name: "id", in: "path" },
    example: "01920000-0000-7000-8000-000000000001",
  }),
})
