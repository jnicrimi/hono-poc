import { defineConfig, devices } from "@playwright/test"
import { apiPort, apiUrl, webPort, webUrl } from "./e2e/support/servers"

const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/app"

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: webUrl,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm --filter @hono-poc/api dev",
      url: `${apiUrl}/health`,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        NODE_ENV: "development",
        PORT: String(apiPort),
        LOG_LEVEL: "info",
        DATABASE_URL: databaseUrl,
        CORS_ALLOWED_ORIGINS: webUrl,
      },
    },
    {
      command: `pnpm --filter @hono-poc/web dev -- --port ${webPort} --strictPort`,
      url: webUrl,
      reuseExistingServer: true,
      timeout: 120_000,
      env: {
        VITE_API_URL: apiUrl,
      },
    },
  ],
})
