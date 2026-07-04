import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "json-summary", "json"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.integration.test.ts",
        "src/**/*.api.test.ts",
        "src/**/test-support/**",
        "src/index.ts",
        "src/shared/config/env.ts",
        "src/shared/db/client.ts",
      ],
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.integration.test.ts", "src/**/*.api.test.ts"],
          restoreMocks: true,
        },
      },
    ],
  },
})
