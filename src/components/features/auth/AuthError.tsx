import { useNavigate, useSearch } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

interface AuthErrorSearch {
  error?: string
  error_description?: string
  state?: string
}

export function AuthError() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/auth/error" }) as AuthErrorSearch

  const error = search.error || "unknown_error"
  const errorDescription = search.error_description || "An unexpected error occurred during authentication."

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "access_denied":
        return {
          title: "Access Denied",
          description: "You denied permission to access your account. Please try again and grant the necessary permissions.",
        }
      case "invalid_request":
        return {
          title: "Invalid Request",
          description: "The authentication request was malformed. Please try again.",
        }
      case "unauthorized_client":
        return {
          title: "Unauthorized Client",
          description: "The application is not authorized to request authentication. Please contact support.",
        }
      case "unsupported_response_type":
        return {
          title: "Unsupported Response Type",
          description: "The requested response type is not supported. Please contact support.",
        }
      case "invalid_scope":
        return {
          title: "Invalid Scope",
          description: "The requested permissions are invalid. Please contact support.",
        }
      case "server_error":
        return {
          title: "Server Error",
          description: "A server error occurred during authentication. Please try again later.",
        }
      case "temporarily_unavailable":
        return {
          title: "Service Temporarily Unavailable",
          description: "The authentication service is temporarily unavailable. Please try again later.",
        }
      default:
        return {
          title: "Authentication Failed",
          description: errorDescription,
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  const handleRetry = () => {
    navigate({ to: "/login", replace: true })
  }

  const handleGoHome = () => {
    navigate({ to: "/", replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-destructive">{errorInfo.title}</CardTitle>
          <CardDescription className="mt-2">
            {errorInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <strong>Error Code:</strong> {error}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            If this problem persists, please contact our support team.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
