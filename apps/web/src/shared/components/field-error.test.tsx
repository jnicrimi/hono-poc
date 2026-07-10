import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { FieldError } from "./field-error"

describe("FieldError", () => {
  it("メッセージがある場合は role=alert のテキストとして表示する", () => {
    render(<FieldError message="エラー-1" />)

    expect(screen.getByRole("alert")).toHaveTextContent("エラー-1")
  })

  it("メッセージがない場合は何も描画しない", () => {
    render(<FieldError message={undefined} />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
