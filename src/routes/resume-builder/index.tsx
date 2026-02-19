import { createFileRoute } from "@tanstack/react-router"
import { ResumeBuilderList } from "@/pages/ResumeBuilder/ResumeBuilderList"

export const Route = createFileRoute("/resume-builder/")({
  component: ResumeBuilderIndexComponent,
})

function ResumeBuilderIndexComponent() {
  return <ResumeBuilderList />
}
