import { createFileRoute, redirect, Outlet } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"

export const Route = createFileRoute("/analysis")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      })
    }
  },
  component: AnalysisLayout,
})

function AnalysisLayout() {
  return <Outlet />
}
