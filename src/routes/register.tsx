import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import PublicHeader from "@/components/layout/PublicHeader"
import { Register } from "@/pages/Register"

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RegisterComponent,
})

function RegisterComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <Register />
    </div>
  )
}
