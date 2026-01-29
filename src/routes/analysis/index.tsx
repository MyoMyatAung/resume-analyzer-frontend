import { createFileRoute } from "@tanstack/react-router"
import AuthHeader from "@/components/layout/AuthHeader"
import { Analysis } from "@/pages/Analysis"

export const Route = createFileRoute("/analysis/")({
  component: AnalysisIndexComponent,
})

function AnalysisIndexComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <Analysis />
    </div>
  )
}
