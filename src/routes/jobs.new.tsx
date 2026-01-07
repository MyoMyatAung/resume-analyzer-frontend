import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import AuthHeader from "@/components/layout/AuthHeader"
import { Jobs } from "@/pages/Jobs"

export const Route = createFileRoute("/jobs/new")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      })
    }
  },
  component: JobsNewComponent,
})

function JobsNewComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <Jobs />
    </div>
  )
}
