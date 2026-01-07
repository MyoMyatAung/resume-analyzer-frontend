import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import AuthHeader from "@/components/layout/AuthHeader"
import { Resumes } from "@/pages/Resumes"

export const Route = createFileRoute("/resumes/upload")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      })
    }
  },
  component: ResumesUploadComponent,
})

function ResumesUploadComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <Resumes />
    </div>
  )
}
