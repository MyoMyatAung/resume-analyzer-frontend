import { createFileRoute } from "@tanstack/react-router"
import AuthHeader from "@/components/layout/AuthHeader"
import { AnalysisDetail } from "@/pages/AnalysisDetail"

export const Route = createFileRoute("/analysis/$id")({
  component: AnalysisDetailComponent,
})

function AnalysisDetailComponent() {
  const { id } = Route.useParams()

  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <AnalysisDetail analysisId={id} />
    </div>
  )
}
