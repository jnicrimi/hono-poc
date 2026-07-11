import type { ApiTag } from "./api-tags"

export const buildOpenApiDocConfig = (tags: readonly ApiTag[]) => ({
  openapi: "3.1.0",
  info: { title: "Hono Poc API", version: "0.0.0" },
  tags: [...tags],
})

export type OpenApiDocConfig = ReturnType<typeof buildOpenApiDocConfig>
