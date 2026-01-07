import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import AuthHeader from "@/components/layout/AuthHeader"
import { Dashboard } from "@/pages/Dashboard"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      })
    }
  },
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <Dashboard />
    </div>
  )
}
