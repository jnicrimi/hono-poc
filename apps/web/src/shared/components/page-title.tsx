import type { LucideIcon } from "lucide-react"
import type { ReactElement, ReactNode } from "react"
import { Card, CardHeader } from "@/shared/ui/card"

export function PageTitle({
  icon: Icon,
  action,
  children,
}: {
  readonly icon: LucideIcon
  readonly action?: ReactElement
  readonly children: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex min-h-8 flex-row items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg">
          <Icon className="size-4" />
          {children}
        </h1>
        {action}
      </CardHeader>
    </Card>
  )
}
