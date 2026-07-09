import * as z from "zod"
import { getAuthorsQueryPageDefault } from "@/shared/api/generated/endpoints/authors/authors.zod"

export const authorListSearchSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .catch(getAuthorsQueryPageDefault)
    .default(getAuthorsQueryPageDefault),
})
