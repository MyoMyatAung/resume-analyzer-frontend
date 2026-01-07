import { useEffect, useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { useCurrentUser } from "@/hooks/useAuth"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface AuthCallbackSearch {
  token?: string
  refreshToken?: string
  error?: string
  error_description?: string
}

export function AuthCallback() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/auth/callback" }) as AuthCallbackSearch
  const { setAuth } = useAuthStore()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use the current user query to validate the token
  const { data: user, isLoading, error: userError } = useCurrentUser()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for OAuth errors in URL parameters
        if (search.error) {
          const errorMessage = search.error_description || search.error
          setError(`Authentication failed: ${errorMessage}`)
          setProcessing(false)
          return
        }

        // Check if we have a token parameter
        if (!search.token) {
          setError("No authentication token received")
          setProcessing(false)
          return
        }

        // Store the token in the auth store
        // Don't set user data here - let useCurrentUser fetch it
        setAuth(null, search.token || "", search.refreshToken || "") // Use both tokens from URL parameters

        // The useCurrentUser query will automatically run and fetch user data
        setProcessing(false)

      } catch (err) {
        console.error("OAuth callback processing error:", err)
        setError("Failed to process authentication")
        setProcessing(false)
      }
    }

    processCallback()
  }, [search, setAuth])

  // Handle successful authentication
  useEffect(() => {
    if (!processing && user && !userError) {
      // Update the auth store with the fetched user data
      setAuth(user, useAuthStore.getState().accessToken || "", useAuthStore.getState().refreshToken || "")

      toast.success("Successfully signed in!", {
        description: `Welcome back, ${user.firstName}!`,
      })

      // Get the return URL from the store and navigate there
      const returnTo = useAuthStore.getState().getReturnTo()
      navigate({ to: returnTo, replace: true })
    }
  }, [user, userError, processing, navigate, setAuth])

  // Handle authentication errors
  useEffect(() => {
    if (!processing && userError) {
      console.error("Failed to fetch user data:", userError)
      setError("Failed to retrieve user information")
      toast.error("Authentication failed", {
        description: "Unable to retrieve your account information",
      })
    }
  }, [userError, processing])

  if (processing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <LoadingSpinner className="h-5 w-5" />
              Authenticating...
            </CardTitle>
            <CardDescription>
              Please wait while we complete your sign-in process.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive">Authentication Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <button
              onClick={() => navigate({ to: "/login", replace: true })}
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              Return to login
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Success!</CardTitle>
            <CardDescription>
              Redirecting you to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return null
}
