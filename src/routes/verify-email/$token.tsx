import PublicHeader from '@/components/layout/PublicHeader'
import { useVerifyEmail } from '@/hooks/useAuth'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/verify-email/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useParams()
  const verifyMutation = useVerifyEmail()

  useEffect(() => {
    verifyMutation.mutate(token)
  }, [token])

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Verifying your email</h1>
          <p className="text-muted-foreground mt-2">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    </div>
  )
}
