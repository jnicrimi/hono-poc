import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "json-summary", "json"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/test-support/**",
        "src/index.ts",
        "src/seed.ts",
        "src/generate-openapi.ts",
        "src/shared/config/env.ts",
        "src/shared/db/client.ts",
        "src/shared/di/seeder.ts",
        "src/modules/*/infrastructure/schema.ts",
      ],
    },
    projects: [
      {
        test: {
          name: "unit",
          include: ["src/**/*.unit.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["src/**/*.integration.test.ts"],
          globalSetup: [
            "src/shared/db/test-support/integration-global-setup.ts",
          ],
          setupFiles: ["src/shared/db/test-support/integration-setup.ts"],
        },
      },
      {
        test: {
          name: "api",
          include: ["src/**/*.api.test.ts"],
        },
      },
    ],
  },
})
