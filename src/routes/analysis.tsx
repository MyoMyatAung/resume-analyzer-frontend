import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import AuthHeader from "@/components/layout/AuthHeader"
import { Analysis } from "@/pages/Analysis"

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
  component: AnalysisComponent,
})

function AnalysisComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <Analysis />
    </div>
  )
}
