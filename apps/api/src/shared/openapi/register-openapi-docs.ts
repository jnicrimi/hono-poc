import { readFileSync } from "node:fs"
import type { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import type { AppEnv } from "../app-env"
import type { ApiTag } from "./api-tags"

export const registerOpenApiDocs = (
  app: OpenAPIHono<AppEnv>,
  options: { readonly enabled: boolean; readonly tags: readonly ApiTag[] },
) => {
  if (!options.enabled) {
    return
  }

  app.doc("/api-docs/json", {
    openapi: "3.1.0",
    info: { title: "Hono Poc API", version: "0.0.0" },
    tags: [...options.tags],
  })

  const js = readFileSync(
    new URL("../../../vendor/scalar/standalone.js", import.meta.url),
    "utf8",
  )

  app.get("/api-docs/assets/scalar-api-reference.js", (c) =>
    c.body(js, 200, { "content-type": "text/javascript; charset=utf-8" }),
  )

  app.get(
    "/api-docs",
    Scalar({
      url: "/api-docs/json",
      cdn: "/api-docs/assets/scalar-api-reference.js",
      theme: "alternate",
      // 上部ツールバーを非表示
      showDeveloperTools: "never",
      // Agent(Ask AI) 機能を無効化
      agent: { disabled: true },
      // サイドメニューの Generate MCP を非表示
      mcp: { disabled: true },
      // サイドメニューの Open API Client を非表示
      hideClientButton: true,
    }),
  )
}
