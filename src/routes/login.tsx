import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import PublicHeader from "@/components/layout/PublicHeader"
import { Login } from "@/pages/Login"

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <Login />
    </div>
  )
}
