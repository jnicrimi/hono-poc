import { z } from "@hono/zod-openapi"

export const createLowercaseUuidSchema = (message: string) =>
  z.uuid(message).refine((value) => value === value.toLowerCase(), message)
