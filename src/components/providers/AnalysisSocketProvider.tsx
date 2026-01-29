import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { analysisSocket } from "@/lib/socket"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"
import { QUERY_KEYS } from "@/lib/constants"

interface AnalysisSocketProviderProps {
  children: React.ReactNode
}

export function AnalysisSocketProvider({ children }: AnalysisSocketProviderProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      analysisSocket.connect()

      analysisSocket.on("connect", () => {
        console.log("Connected to analysis socket")
        analysisSocket.emit("join", user.id)
      })

      analysisSocket.on("analysisStatus", (data) => {
        console.log("Analysis update received:", data)

        // Invalidate all analysis queries to ensure UI updates
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ANALYSIS
        })

        if (data.status === "COMPLETED") {
          toast.success("Analysis complete!", {
            description: "Your resume analysis is ready to view.",
            duration: 10000, // Keep toast visible for 10 seconds
            action: data.analysisId
              ? {
                  label: "View Results",
                  onClick: () => {
                    navigate({ to: "/analysis/$id", params: { id: data.analysisId } })
                  },
                }
              : undefined,
          })
        } else if (data.status === "FAILED") {
          toast.error("Analysis failed", {
            description: data.error || "An error occurred during analysis.",
            duration: 10000,
          })
        }
      })

      analysisSocket.on("disconnect", () => {
        console.log("Disconnected from analysis socket")
      })

      return () => {
        analysisSocket.off("connect")
        analysisSocket.off("analysisStatus")
        analysisSocket.off("disconnect")
        analysisSocket.disconnect()
      }
    }
  }, [isAuthenticated, user, queryClient, navigate])

  return <>{children}</>
}
