import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "json-summary", "json"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
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
          include: ["src/**/*.unit.test.ts"],
          restoreMocks: true,
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["src/**/*.integration.test.ts"],
          globalSetup: [
            "src/shared/db/test-support/integration-global-setup.ts",
          ],
          setupFiles: ["src/shared/db/test-support/integration-setup.ts"],
          restoreMocks: true,
        },
      },
    ],
  },
})
