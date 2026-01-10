import axios from "axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await useAuthStore.getState().refreshAccessToken()
        // Update the authorization header with the new token
        const newToken = useAuthStore.getState().accessToken
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        // Use React Router navigation instead of window.location.href for better SPA experience
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 429) {
      toast.error("Too many requests. Please try again later.")
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)
