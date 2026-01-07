import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function createRouter(options?: { context?: Record<string, unknown> }) {
  return createTanStackRouter({ routeTree, ...options })
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
