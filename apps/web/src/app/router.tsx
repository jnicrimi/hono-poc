import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { routeTree } from "@/route-tree.gen"
import { createQueryClient } from "@/shared/lib/query-client"

const queryClient = createQueryClient()

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  Wrap: ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
