import { createFileRoute } from "@tanstack/react-router"
import { AuthError } from "@/components/features/auth/AuthError"

export const Route = createFileRoute("/auth/error")({
  component: AuthError,
})
