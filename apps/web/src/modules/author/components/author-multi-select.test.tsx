import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { AuthorMultiSelect } from "./author-multi-select"

const options = [
  { id: "a1", name: "著者-1" },
  { id: "a2", name: "著者-2" },
  { id: "a3", name: "著者-3" },
]

describe("AuthorMultiSelect", () => {
  it("未選択の場合はプレースホルダを表示する", () => {
    render(
      <AuthorMultiSelect options={options} value={[]} onChange={() => {}} />,
    )

    expect(screen.getByText("著者を選択")).toBeInTheDocument()
  })

  it("選択済みの件数を表示する", () => {
    render(
      <AuthorMultiSelect
        options={options}
        value={["a1", "a2"]}
        onChange={() => {}}
      />,
    )

    expect(screen.getByText("2名の著者")).toBeInTheDocument()
  })

  it("選択済みの著者名を表示する", () => {
    render(
      <AuthorMultiSelect
        options={options}
        value={["a1"]}
        onChange={() => {}}
      />,
    )

    expect(screen.getByText("著者-1")).toBeInTheDocument()
  })

  it("options に無い id は id をそのまま表示する", () => {
    render(
      <AuthorMultiSelect
        options={options}
        value={["unknown"]}
        onChange={() => {}}
      />,
    )

    expect(screen.getByText("unknown")).toBeInTheDocument()
  })

  it("オプションを選ぶと追加後の id 配列を onChange に渡す", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AuthorMultiSelect options={options} value={[]} onChange={onChange} />,
    )

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-3" }))

    expect(onChange).toHaveBeenCalledWith(["a3"])
  })

  it("選択済みのオプションを選ぶと除外後の id 配列を onChange に渡す", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AuthorMultiSelect
        options={options}
        value={["a1"]}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "著者-1" }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it("検索入力でオプションを絞り込む", async () => {
    const user = userEvent.setup()
    render(
      <AuthorMultiSelect options={options} value={[]} onChange={() => {}} />,
    )

    await user.click(screen.getByRole("combobox"))
    await user.type(await screen.findByPlaceholderText("著者を検索"), "著者-1")

    expect(screen.getByRole("option", { name: "著者-1" })).toBeInTheDocument()
    expect(
      screen.queryByRole("option", { name: "著者-2" }),
    ).not.toBeInTheDocument()
  })

  it("一致しない検索の場合は空状態メッセージを表示する", async () => {
    const user = userEvent.setup()
    render(
      <AuthorMultiSelect options={options} value={[]} onChange={() => {}} />,
    )

    await user.click(screen.getByRole("combobox"))
    await user.type(await screen.findByPlaceholderText("著者を検索"), "zzz")

    expect(screen.getByText("著者が見つかりません")).toBeInTheDocument()
  })
})
