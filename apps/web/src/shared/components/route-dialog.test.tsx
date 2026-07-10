import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { RouteDialog } from "./route-dialog"

describe("RouteDialog", () => {
  it("タイトルと子要素をダイアログとして表示する", () => {
    render(
      <RouteDialog title="ダイアログタイトル" onClose={vi.fn()}>
        <p>ダイアログ本文</p>
      </RouteDialog>,
    )

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAccessibleName("ダイアログタイトル")
    expect(screen.getByText("ダイアログ本文")).toBeInTheDocument()
  })

  it("閉じるボタンを押した場合は onClose を呼ぶ", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <RouteDialog title="ダイアログタイトル" onClose={onClose}>
        <p>ダイアログ本文</p>
      </RouteDialog>,
    )

    await user.click(screen.getByRole("button", { name: "Close" }))

    expect(onClose).toHaveBeenCalledExactlyOnceWith()
  })

  it("Escape キーを押した場合は onClose を呼ぶ", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <RouteDialog title="ダイアログタイトル" onClose={onClose}>
        <p>ダイアログ本文</p>
      </RouteDialog>,
    )

    await user.keyboard("{Escape}")

    expect(onClose).toHaveBeenCalledExactlyOnceWith()
  })
})
