import * as z from "zod"
import { getBooksQueryPageDefault } from "@/shared/api/generated/endpoints/books/books.zod"

export const bookListSearchSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .catch(getBooksQueryPageDefault)
    .default(getBooksQueryPageDefault),
})
