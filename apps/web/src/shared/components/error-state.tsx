import { CircleAlert } from "lucide-react"

export function ErrorState({ description }: { readonly description: string }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 py-10 text-muted-foreground"
    >
      <CircleAlert className="size-6" />
      <p className="text-sm">{description}</p>
    </div>
  )
}
