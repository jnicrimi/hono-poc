import { createRouter } from "@tanstack/react-router"
import { routeTree } from "@/route-tree.gen"
import { RouteErrorBoundary } from "@/shared/components/route-error-boundary"
import { createQueryClient } from "@/shared/lib/query-client"
import { AppProviders } from "./providers"

const queryClient = createQueryClient()

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: RouteErrorBoundary,
  context: { queryClient },
  Wrap: ({ children }) => (
    <AppProviders queryClient={queryClient}>{children}</AppProviders>
  ),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
