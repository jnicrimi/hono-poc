import { useMemo } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/shared/ui/combobox"
import { authorLabels } from "../text/author-labels"

export type AuthorOption = {
  readonly id: string
  readonly name: string
}

export function AuthorMultiSelect({
  id,
  options,
  value,
  onChange,
}: {
  readonly id?: string
  readonly options: readonly AuthorOption[]
  readonly value: readonly string[]
  readonly onChange: (next: readonly string[]) => void
}) {
  const anchor = useComboboxAnchor()
  const optionIds = useMemo(() => options.map((option) => option.id), [options])
  const nameById = useMemo(
    () => new Map(options.map((option) => [option.id, option.name])),
    [options],
  )

  const resolveLabel = (authorId: string) => nameById.get(authorId) ?? authorId

  return (
    <Combobox
      multiple
      items={optionIds}
      value={[...value]}
      onValueChange={(next, details) => {
        // Base UI はポップアップが閉じた状態の Escape で選択を全解除するため、取り消して Escape を外側に伝える
        if (details.reason === "escape-key") {
          details.cancel()
          details.allowPropagation()
          return
        }
        onChange(next)
      }}
      itemToStringLabel={resolveLabel}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: string[]) =>
            selected.map((authorId) => (
              <ComboboxChip
                key={authorId}
                removeLabel={authorLabels.deselect(resolveLabel(authorId))}
              >
                {resolveLabel(authorId)}
              </ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput
          id={id}
          placeholder={authorLabels.searchPlaceholder}
        />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{authorLabels.searchEmpty}</ComboboxEmpty>
        <ComboboxList>
          {(authorId: string) => (
            <ComboboxItem key={authorId} value={authorId}>
              {resolveLabel(authorId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
