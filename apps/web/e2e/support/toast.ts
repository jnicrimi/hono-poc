import type { Page } from "@playwright/test"

// sonner はコンテナの aria-label 末尾にショートカットキーの表記を付与する
export const toastRegion = (page: Page) =>
  page.getByRole("region", { name: /^通知/ })
