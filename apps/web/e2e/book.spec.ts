import { expect, test } from "@playwright/test"
import {
  createAuthor,
  createBook,
  deleteAuthor,
  deleteBook,
  findBookIdByName,
  getBookVersion,
  uniqueName,
  updateBook,
} from "./support/api"
import { gotoBookRow } from "./support/list-row"

test.describe("書籍", () => {
  test("著者を選択して書籍を登録すると成功トーストが表示され一覧に載る", async ({
    page,
    request,
  }) => {
    const authorName = uniqueName("著者")
    const authorId = await createAuthor(request, authorName)
    const title = uniqueName("書籍")

    await page.goto("/books")
    await page.getByRole("link", { name: "登録" }).click()
    await page.getByRole("textbox", { name: "書籍タイトル" }).fill(title)
    await page.getByRole("combobox").click()
    await page.getByPlaceholder("著者を検索").fill(authorName)
    await page.getByRole("option", { name: authorName }).click()
    await page.keyboard.press("Escape")
    await page.getByRole("button", { name: "登録" }).click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("書籍を登録しました"),
    ).toBeVisible()

    const id = await findBookIdByName(request, title)
    await gotoBookRow(page, request, { id, rowName: title })

    await deleteBook(request, id)
    await deleteAuthor(request, authorId)
  })

  test("書籍タイトルを更新すると成功トーストが表示され一覧に反映される", async ({
    page,
    request,
  }) => {
    const authorId = await createAuthor(request, uniqueName("著者"))
    const title = uniqueName("書籍")
    const id = await createBook(request, { title, authorIds: [authorId] })
    const updatedTitle = uniqueName("書籍")

    await gotoBookRow(page, request, { id, rowName: title })
    await page
      .getByRole("row", { name: title })
      .getByRole("link", { name: "編集" })
      .click()
    await page.getByRole("textbox", { name: "書籍タイトル" }).fill(updatedTitle)
    await page.getByRole("button", { name: "更新" }).click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("書籍を更新しました"),
    ).toBeVisible()

    await gotoBookRow(page, request, { id, rowName: updatedTitle })

    await deleteBook(request, id)
    await deleteAuthor(request, authorId)
  })

  test("書籍を削除すると成功トーストが表示され一覧から消える", async ({
    page,
    request,
  }) => {
    const authorId = await createAuthor(request, uniqueName("著者"))
    const title = uniqueName("書籍")
    const id = await createBook(request, { title, authorIds: [authorId] })

    await gotoBookRow(page, request, { id, rowName: title })
    await page
      .getByRole("row", { name: title })
      .getByRole("button", { name: "削除" })
      .click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "削除" })
      .click()

    await expect(
      page.locator("[data-sonner-toaster]").getByText("書籍を削除しました"),
    ).toBeVisible()
    await expect(page.getByRole("alertdialog")).toBeHidden()
    await expect(page.getByRole("cell", { name: title })).toBeHidden()

    await deleteAuthor(request, authorId)
  })

  test("編集中に他の操作で更新された書籍を保存すると競合トーストを表示し入力を保持する", async ({
    page,
    request,
  }) => {
    const authorId = await createAuthor(request, uniqueName("著者"))
    const title = uniqueName("書籍")
    const id = await createBook(request, { title, authorIds: [authorId] })
    const inputTitle = uniqueName("書籍")

    await gotoBookRow(page, request, { id, rowName: title })
    await page
      .getByRole("row", { name: title })
      .getByRole("link", { name: "編集" })
      .click()
    const input = page.getByRole("textbox", { name: "書籍タイトル" })
    await expect(input).toHaveValue(title)

    await updateBook(request, id, {
      title: uniqueName("書籍"),
      authorIds: [authorId],
      version: await getBookVersion(request, id),
    })

    await input.fill(inputTitle)
    await page.getByRole("button", { name: "更新" }).click()

    await expect(
      page
        .locator("[data-sonner-toaster]")
        .getByText("他の操作で更新されました。ページを再読み込みしてください"),
    ).toBeVisible()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(input).toHaveValue(inputTitle)

    await deleteBook(request, id)
    await deleteAuthor(request, authorId)
  })
})
