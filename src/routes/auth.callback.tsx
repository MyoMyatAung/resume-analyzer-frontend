import { createFileRoute } from "@tanstack/react-router"
import { AuthCallback } from "@/components/features/auth/AuthCallback"

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
})
