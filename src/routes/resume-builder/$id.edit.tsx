import { createFileRoute } from "@tanstack/react-router"
import { ResumeBuilderEdit } from "@/pages/ResumeBuilder/ResumeBuilderEdit"

export const Route = createFileRoute("/resume-builder/$id/edit")({
  component: ResumeBuilderEditComponent,
})

function ResumeBuilderEditComponent() {
  const { id } = Route.useParams()
  return <ResumeBuilderEdit resumeId={id} />
}
