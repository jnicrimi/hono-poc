import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { render } from "@testing-library/react"
import { type ReactElement, type ReactNode, Suspense } from "react"
import { RouteErrorBoundary } from "@/shared/components/route-error-boundary"

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  })

type StubRoute = {
  readonly path: string
  readonly component: () => ReactNode
}

export const renderWithRouter = (
  ui: ReactElement,
  {
    initialEntries = ["/"],
    routes = [],
  }: {
    readonly initialEntries?: readonly string[]
    readonly routes?: readonly StubRoute[]
  } = {},
) => {
  const queryClient = createTestQueryClient()
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => ui,
  })
  const stubRoutes = routes.map((route) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: route.path,
      component: route.component,
    }),
  )
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, ...stubRoutes]),
    history: createMemoryHistory({ initialEntries: [...initialEntries] }),
    defaultErrorComponent: RouteErrorBoundary,
  })

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>,
    ),
    queryClient,
    router,
  }
}
