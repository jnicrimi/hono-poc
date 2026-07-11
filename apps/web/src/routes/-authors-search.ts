import * as z from "zod"
import { listAuthorsQueryPageDefault } from "@/shared/api/generated/endpoints/authors/authors.zod"

export const authorListSearchSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .catch(listAuthorsQueryPageDefault)
    .default(listAuthorsQueryPageDefault),
})
