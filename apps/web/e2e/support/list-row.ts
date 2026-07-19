import { type APIRequestContext, expect, type Page } from "@playwright/test"
import { resolveListPage } from "./api"

export const gotoAuthorRow = async (
  page: Page,
  request: APIRequestContext,
  target: { id: string; rowName: string },
) => {
  await gotoListPageWithRow(page, request, "authors", target)
}

export const gotoBookRow = async (
  page: Page,
  request: APIRequestContext,
  target: { id: string; rowName: string },
) => {
  await gotoListPageWithRow(page, request, "books", target)
}

const gotoListPageWithRow = async (
  page: Page,
  request: APIRequestContext,
  resource: "authors" | "books",
  { id, rowName }: { id: string; rowName: string },
) => {
  await expect(async () => {
    const listPage = await resolveListPage(request, resource, id)
    await page.goto(`/${resource}?page=${listPage}`)
    await expect(page.getByRole("row", { name: rowName })).toBeVisible({
      timeout: 2_000,
    })
  }).toPass()
}
