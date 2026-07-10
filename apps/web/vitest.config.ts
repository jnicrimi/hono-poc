import { fileURLToPath, URL } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    restoreMocks: true,
    setupFiles: ["./src/shared/test-support/setup.ts"],
    env: { VITE_API_URL: "http://localhost:3000" },
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "html", "json-summary", "json"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/**/test-support/**",
        "src/shared/api/generated/**",
        "src/shared/ui/**",
        "src/route-tree.gen.ts",
        "src/app/router.tsx",
        "src/main.tsx",
      ],
    },
  },
})
