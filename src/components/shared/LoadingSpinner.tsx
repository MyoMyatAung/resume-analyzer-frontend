import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn("h-8 w-8 animate-spin text-primary", className)} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  )
}
