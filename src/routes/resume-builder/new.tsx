import { createFileRoute } from "@tanstack/react-router"
import { ResumeBuilderNew } from "@/pages/ResumeBuilder/ResumeBuilderNew"

export const Route = createFileRoute("/resume-builder/new")({
  component: ResumeBuilderNewComponent,
})

function ResumeBuilderNewComponent() {
  return <ResumeBuilderNew />
}
