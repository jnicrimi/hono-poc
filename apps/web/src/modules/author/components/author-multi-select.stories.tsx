import type { Meta, StoryObj } from "@storybook/react-vite"
import { type ComponentProps, useState } from "react"
import { AuthorMultiSelect } from "./author-multi-select"

const options = [
  { id: "a1", name: "著者-1" },
  { id: "a2", name: "著者-2" },
  { id: "a3", name: "著者-3" },
]

function AuthorMultiSelectDemo({
  value: initialValue,
  ...args
}: ComponentProps<typeof AuthorMultiSelect>) {
  const [value, setValue] = useState(initialValue)
  return <AuthorMultiSelect {...args} value={value} onChange={setValue} />
}

const meta = {
  component: AuthorMultiSelect,
  args: { options, value: [], onChange: () => {} },
  render: (args) => (
    <AuthorMultiSelectDemo key={args.value.join(",")} {...args} />
  ),
} satisfies Meta<typeof AuthorMultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
