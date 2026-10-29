import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { Toaster } from "sonner"
import { uiLabels } from "@/shared/text/ui-labels"

export function AppProviders({
  queryClient,
  children,
}: {
  readonly queryClient: QueryClient
  readonly children: ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        richColors
        position="top-center"
        containerAriaLabel={uiLabels.notifications}
      />
    </QueryClientProvider>
  )
}
