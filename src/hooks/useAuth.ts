import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import type { LoginCredentials, RegisterData, User, OAuthInitiateResponse } from "@/types/auth"

async function fetchCurrentUser(): Promise<User> {
  const response = await api.get("/auth/me", {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  return response.data
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post("/auth/login", credentials)
      return response.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      queryClient.invalidateQueries({ queryKey: ["user"] })
      navigate({ to: "/dashboard" })
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      try {
        toast.error("Login failed", {
          description: axiosError.response?.data?.message || "Invalid email or password",
        })
      } catch {
        console.error("Failed to show toast")
      }
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post("/auth/register", data)
      return response.data
    },
    onSuccess: (_, variables) => {
      toast.success("Registration successful", {
        description: "Please check your email to verify your account",
      })
      navigate({ to: "/verify-email", search: { email: variables.email } })
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      try {
        toast.error("Registration failed", {
          description: axiosError.response?.data?.message || "An error occurred during registration",
        })
      } catch {
        console.error("Failed to show toast")
      }
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)

  return () => {
    logout()
    queryClient.clear()
    navigate({ to: "/" })
  }
}

export function useInitiateGoogleOAuth() {
  return useMutation({
    mutationFn: async (): Promise<OAuthInitiateResponse> => {
      const response = await api.get("/auth/google")
      return response.data
    },
    onSuccess: (data) => {
      // Redirect to the OAuth URL
      window.location.href = data.url
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error("Failed to initiate Google authentication", {
        description: axiosError.response?.data?.message || "Please try again later",
      })
    },
  })
}

export function useInitiateGithubOAuth() {
  return useMutation({
    mutationFn: async (): Promise<OAuthInitiateResponse> => {
      const response = await api.get("/auth/github")
      return response.data
    },
    onSuccess: (data) => {
      // Redirect to the OAuth URL
      window.location.href = data.url
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error("Failed to initiate GitHub authentication", {
        description: axiosError.response?.data?.message || "Please try again later",
      })
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post("/auth/resend-verification", { email })
      return response.data
    },
    onSuccess: () => {
      toast.success("Verification email sent", {
        description: "Please check your email for the verification link",
      })
    },
    onError: (error: unknown) => {
      // 429 is handled by interceptor, so only handle other errors
      const axiosError = error as { response?: { data?: { message?: string }, status?: number } }
      if (axiosError.response?.status !== 429) {
        toast.error("Failed to resend verification email", {
          description: axiosError.response?.data?.message || "Please try again later",
        })
      }
    },
  })
}

export function useVerifyEmail() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.get(`/auth/verify-email/${token}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("Email verified successfully", {
        description: "You can now log in to your account",
      })
      navigate({ to: "/login" })
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      toast.error("Email verification failed", {
        description: axiosError.response?.data?.message || "Invalid or expired token",
      })
    },
  })
}
