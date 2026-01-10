import { useSearch } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useResendVerification } from "@/hooks/useAuth"
import { Mail } from "lucide-react"

export function VerifyEmailForm() {
  const { email } = useSearch({ from: "/verify-email/" }) as { email?: string }
  const resendMutation = useResendVerification()

  const handleResend = async () => {
    if (email) {
      await resendMutation.mutateAsync(email)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground mt-2">
          We've sent a verification link to
        </p>
        <p className="font-medium text-foreground mt-1">{email}</p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Didn't receive the email? Check your spam folder or click below to resend.
        </p>

        <Button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          className="w-full"
        >
          {resendMutation.isPending ? "Sending..." : "Resend verification email"}
        </Button>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  )
}