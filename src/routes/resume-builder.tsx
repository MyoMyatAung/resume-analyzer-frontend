import { createFileRoute, Outlet } from "@tanstack/react-router"
import AuthHeader from "@/components/layout/AuthHeader"
import { ResumeBuilderSocketProvider } from "@/components/providers/ResumeBuilderSocketProvider"

export const Route = createFileRoute("/resume-builder")({
  component: ResumeBuilderLayout,
})

function ResumeBuilderLayout() {
  return (
    <ResumeBuilderSocketProvider>
      <div className="min-h-screen flex flex-col">
        <AuthHeader />
        <Outlet />
      </div>
    </ResumeBuilderSocketProvider>
  )
}
