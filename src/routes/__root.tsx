import { createRootRoute, Outlet } from "@tanstack/react-router"
import { AnalysisSocketProvider } from "@/components/providers/AnalysisSocketProvider"

export const Route = createRootRoute({
  component: () => {
    return (
      <AnalysisSocketProvider>
        <Outlet />
      </AnalysisSocketProvider>
    )
  },
})
