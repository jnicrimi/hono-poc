import * as z from "zod"
import { listBooksQueryPageDefault } from "@/shared/api/generated/endpoints/books/books.zod"

export const bookListSearchSchema = z.object({
  page: z
    .number()
    .int()
    .min(1)
    .catch(listBooksQueryPageDefault)
    .default(listBooksQueryPageDefault),
})
