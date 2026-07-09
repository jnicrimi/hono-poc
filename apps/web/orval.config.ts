import { defineConfig } from "orval"

const SPEC_URL = "http://localhost:3000/api-docs/json"

export default defineConfig({
  honoPocApi: {
    input: { target: SPEC_URL },
    output: {
      mode: "tags-split",
      client: "react-query",
      httpClient: "fetch",
      target: "src/shared/api/generated/endpoints",
      schemas: "src/shared/api/generated/models",
      mock: { generators: [{ type: "msw", delay: false }] },
      override: {
        mutator: {
          path: "./src/shared/api/fetch-mutator.ts",
          name: "customFetch",
        },
        query: { useSuspenseQuery: true },
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
})
