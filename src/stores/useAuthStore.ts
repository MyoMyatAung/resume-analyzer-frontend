import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/auth"

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  returnTo: string | null
  setAuth: (user: User | null, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  refreshAccessToken: () => Promise<void>
  setReturnTo: (path: string) => void
  clearReturnTo: () => void
  getReturnTo: () => string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      returnTo: null,

      setAuth: (user, accessToken, refreshToken) => {
        set({
          user: user || null,
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        })
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          returnTo: null,
        })
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } })
        }
      },

      refreshAccessToken: async () => {
        const refreshToken = get().refreshToken
        if (!refreshToken) {
          get().logout()
          throw new Error("No refresh token available")
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken }),
            }
          )

          if (!response.ok) {
            throw new Error("Failed to refresh token")
          }

          const data = await response.json()
          set({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        } catch (error) {
          get().logout()
          throw error
        }
      },

      setReturnTo: (path) => {
        set({ returnTo: path })
      },

      clearReturnTo: () => {
        set({ returnTo: null })
      },

      getReturnTo: () => {
        return get().returnTo || "/dashboard"
      },
    }),
    {
      name: "tanalyze-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
