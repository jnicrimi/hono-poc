import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover"
import { authorLabels } from "../text/author-labels"

export type AuthorOption = {
  readonly id: string
  readonly name: string
}

export function AuthorMultiSelect({
  options,
  value,
  onChange,
}: {
  readonly options: readonly AuthorOption[]
  readonly value: readonly string[]
  readonly onChange: (next: readonly string[]) => void
}) {
  const [search, setSearch] = useState("")

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    )
  }

  const filtered = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  )

  const resolveLabel = (id: string) =>
    options.find((option) => option.id === id)?.name ?? id

  return (
    <div className="flex flex-col gap-2">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              role="combobox"
              className="w-full justify-between font-normal"
            />
          }
        >
          <span
            className={value.length === 0 ? "text-muted-foreground" : undefined}
          >
            {value.length === 0
              ? authorLabels.selectPlaceholder
              : authorLabels.selectedCount(value.length)}
          </span>
          <ChevronsUpDown className="shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={authorLabels.searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground text-sm">
                  {authorLabels.searchEmpty}
                </div>
              ) : (
                filtered.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => toggle(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(option.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.name}
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((id) => (
            <Badge key={id} variant="outline">
              {resolveLabel(id)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
