import { OpenAPIHono } from "@hono/zod-openapi"
import type { AppEnv } from "../app-env"
import { httpMessages } from "../error/http-messages"

export const createOpenApiApp = () =>
  new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (result.success) {
        return
      }
      const errors = result.error.issues.map((issue) => ({
        ...(issue.path.length > 0 ? { field: issue.path.join(".") } : {}),
        message: issue.message,
      }))
      const status =
        result.target === "param" || result.target === "query" ? 400 : 422
      return c.json(
        {
          errors:
            errors.length > 0
              ? errors
              : [{ message: httpMessages.invalidRequest }],
        },
        status,
      )
    },
  })
