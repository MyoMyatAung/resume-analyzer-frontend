import { createFileRoute } from "@tanstack/react-router"
import PublicHeader from "@/components/layout/PublicHeader"
import { Landing } from "@/pages/Landing"

export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <Landing />
    </div>
  )
}
