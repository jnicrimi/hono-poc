import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from "@playwright/test"
import {
  createAuthor,
  createBook,
  deleteAuthor,
  deleteBook,
  findAuthorIdByName,
  getAuthorVersion,
  resolveListPage,
  uniqueName,
  updateAuthor,
} from "./support/api"
import { gotoAuthorRow, gotoBookRow } from "./support/list-row"

const gotoRowViaClientNav = async (
  page: Page,
  request: APIRequestContext,
  target: {
    navName: string
    resource: "authors" | "books"
    id: string
    rowName: string
    cellText?: string
  },
) => {
  await expect(async () => {
    await page
      .getByRole("banner")
      .getByRole("link", { name: target.navName })
      .click()
    const listPage = await resolveListPage(request, target.resource, target.id)
    if (listPage > 1) {
      await page
        .getByRole("link", { name: String(listPage), exact: true })
        .click()
    }
    const row = page.getByRole("row", { name: target.rowName })
    await expect(row).toBeVisible({ timeout: 2_000 })
    if (target.cellText !== undefined) {
      await expect(row.getByText(target.cellText)).toBeVisible({
        timeout: 2_000,
      })
    }
  }).toPass()
}

test.describe("著者", () => {
  test("著者を登録すると成功トーストが表示され一覧に載る", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")

    await page.goto("/authors")
    await page.getByRole("link", { name: "登録" }).click()
    await page.getByRole("textbox", { name: "著者名" }).fill(name)
    await page.getByRole("button", { name: "登録" }).click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("著者を登録しました"),
    ).toBeVisible()

    const id = await findAuthorIdByName(request, name)
    await gotoAuthorRow(page, request, { id, rowName: name })

    await deleteAuthor(request, id)
  })

  test("著者名を更新すると成功トーストが表示され一覧に反映される", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")
    const id = await createAuthor(request, name)
    const updatedName = uniqueName("著者")

    await gotoAuthorRow(page, request, { id, rowName: name })
    await page
      .getByRole("row", { name })
      .getByRole("link", { name: "編集" })
      .click()
    await page.getByRole("textbox", { name: "著者名" }).fill(updatedName)
    await page.getByRole("button", { name: "更新" }).click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("著者を更新しました"),
    ).toBeVisible()

    await gotoAuthorRow(page, request, { id, rowName: updatedName })

    await deleteAuthor(request, id)
  })

  test("著者名を更新すると書籍一覧の著者名表示も更新される", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")
    const authorId = await createAuthor(request, name)
    const updatedName = uniqueName("著者")
    const bookTitle = uniqueName("書籍")
    const bookId = await createBook(request, {
      title: bookTitle,
      authorIds: [authorId],
    })

    await gotoBookRow(page, request, { id: bookId, rowName: bookTitle })
    await expect(
      page.getByRole("row", { name: bookTitle }).getByText(name),
    ).toBeVisible()

    await gotoRowViaClientNav(page, request, {
      navName: "著者",
      resource: "authors",
      id: authorId,
      rowName: name,
    })
    await page
      .getByRole("row", { name })
      .getByRole("link", { name: "編集" })
      .click()
    await page.getByRole("textbox", { name: "著者名" }).fill(updatedName)
    await page.getByRole("button", { name: "更新" }).click()
    await expect(
      page.locator("[data-sonner-toaster]").getByText("著者を更新しました"),
    ).toBeVisible()

    await gotoRowViaClientNav(page, request, {
      navName: "書籍",
      resource: "books",
      id: bookId,
      rowName: bookTitle,
      cellText: updatedName,
    })

    await deleteBook(request, bookId)
    await deleteAuthor(request, authorId)
  })

  test("著者を削除すると成功トーストが表示され一覧から消える", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")
    const id = await createAuthor(request, name)

    await gotoAuthorRow(page, request, { id, rowName: name })
    await page
      .getByRole("row", { name })
      .getByRole("button", { name: "削除" })
      .click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "削除" })
      .click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("著者を削除しました"),
    ).toBeVisible()
    await expect(page.getByRole("alertdialog")).toBeHidden()
    await expect(page.getByRole("cell", { name })).toBeHidden()
  })

  test("編集中に他の操作で更新された著者を保存すると競合トーストを表示し入力を保持する", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")
    const id = await createAuthor(request, name)
    const inputName = uniqueName("著者")

    await gotoAuthorRow(page, request, { id, rowName: name })
    await page
      .getByRole("row", { name })
      .getByRole("link", { name: "編集" })
      .click()
    const input = page.getByRole("textbox", { name: "著者名" })
    await expect(input).toHaveValue(name)

    await updateAuthor(request, id, {
      name: uniqueName("著者"),
      version: await getAuthorVersion(request, id),
    })

    await input.fill(inputName)
    await page.getByRole("button", { name: "更新" }).click()

    await expect(
      page
        .locator("[data-sonner-toaster]")
        .getByText("他の操作で更新されました。ページを再読み込みしてください"),
    ).toBeVisible()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(input).toHaveValue(inputName)

    await deleteAuthor(request, id)
  })

  test("書籍に割り当てられている著者を削除するとエラートーストが表示され一覧に残る", async ({
    page,
    request,
  }) => {
    const name = uniqueName("著者")
    const authorId = await createAuthor(request, name)
    const bookId = await createBook(request, {
      title: uniqueName("書籍"),
      authorIds: [authorId],
    })

    await gotoAuthorRow(page, request, { id: authorId, rowName: name })
    await page
      .getByRole("row", { name })
      .getByRole("button", { name: "削除" })
      .click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "削除" })
      .click()

    await expect(
      page
        .locator("[data-sonner-toaster]")
        .getByText("書籍に割り当てられている著者は削除できません"),
    ).toBeVisible()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "キャンセル" })
      .click()
    await expect(page.getByRole("row", { name })).toBeVisible()

    await deleteBook(request, bookId)
    await deleteAuthor(request, authorId)
  })
})
