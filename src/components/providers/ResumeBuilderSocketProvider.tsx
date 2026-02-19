import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Socket } from "socket.io-client"
import { createResumeBuilderSocket, disconnectResumeBuilderSocket } from "@/lib/resume-builder-socket"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"
import { QUERY_KEYS } from "@/lib/constants"
import type {
  AICompleteEvent,
  AIProgressEvent,
  PDFCompleteEvent,
  PDFProgressEvent,
  ErrorEvent,
  AIContentResult,
  AIContentType,
} from "@/types/resume-builder"

interface ResumeBuilderSocketContextValue {
  isConnected: boolean
  connectionError: string | null
  lastAIResult: { contentType: AIContentType; result: AIContentResult; jobId: string } | null
  clearAIResult: () => void
}

const ResumeBuilderSocketContext = createContext<ResumeBuilderSocketContextValue | null>(null)

export function useResumeBuilderSocket() {
  const context = useContext(ResumeBuilderSocketContext)
  if (!context) {
    throw new Error("useResumeBuilderSocket must be used within ResumeBuilderSocketProvider")
  }
  return context
}

interface ResumeBuilderSocketProviderProps {
  children: React.ReactNode
}

export function ResumeBuilderSocketProvider({ children }: ResumeBuilderSocketProviderProps) {
  const queryClient = useQueryClient()
  const { accessToken, isAuthenticated } = useAuthStore()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [lastAIResult, setLastAIResult] = useState<{
    contentType: AIContentType
    result: AIContentResult
    jobId: string
  } | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const clearAIResult = useCallback(() => {
    setLastAIResult(null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setIsConnected(false)
      return
    }

    // Create and connect socket
    const socket = createResumeBuilderSocket(accessToken)
    socketRef.current = socket

    // Connection handlers
    socket.on("connect", () => {
      console.log("[ResumeBuilder Socket] Connected")
      setIsConnected(true)
      setConnectionError(null)
    })

    socket.on("connected", (data) => {
      console.log("[ResumeBuilder Socket] Acknowledged:", data)
    })

    socket.on("disconnect", (reason) => {
      console.log("[ResumeBuilder Socket] Disconnected:", reason)
      setIsConnected(false)
      
      // Per requirements: no auto-reconnect, user must refresh
      if (reason === "io server disconnect" || reason === "transport close") {
        setConnectionError("Connection lost. Please refresh the page to reconnect.")
        toast.error("Connection Lost", {
          description: "Please refresh the page to reconnect.",
          duration: 0, // Keep visible until dismissed
        })
      }
    })

    socket.on("connect_error", (error) => {
      console.error("[ResumeBuilder Socket] Connection error:", error)
      setConnectionError(error.message)
    })

    // AI content events
    socket.on("ai:complete", (data: AICompleteEvent) => {
      console.log("[ResumeBuilder Socket] AI complete:", data)
      
      setLastAIResult({
        contentType: data.contentType,
        result: data.result,
        jobId: data.jobId,
      })

      // Show success toast based on content type
      const messages: Record<AIContentType, string> = {
        "generate-summary": "Professional summary generated!",
        "enhance-experience": "Experience bullets enhanced!",
        "suggest-skills": "Skill suggestions ready!",
        "improve-achievements": "Achievement improved!",
      }

      toast.success("AI Content Ready", {
        description: messages[data.contentType] || "AI content generated successfully.",
      })
    })

    socket.on("ai:progress", (data: AIProgressEvent) => {
      console.log("[ResumeBuilder Socket] AI progress:", data)
      // Could show a loading indicator or progress message
    })

    // PDF events
    socket.on("pdf:complete", (data: PDFCompleteEvent) => {
      console.log("[ResumeBuilder Socket] PDF complete:", data)
      
      // Invalidate resume queries to update PDF status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUMES })
      
      toast.success("PDF Generated!", {
        description: "Your resume PDF is ready for download.",
        action: {
          label: "Download",
          onClick: () => {
            // Download will be handled by the component
            window.open(data.pdfUrl, "_blank")
          },
        },
      })
    })

    socket.on("pdf:progress", (data: PDFProgressEvent) => {
      console.log("[ResumeBuilder Socket] PDF progress:", data)
      // Could show generation progress
    })

    // Error events
    socket.on("error", (data: ErrorEvent) => {
      console.error("[ResumeBuilder Socket] Error:", data)
      toast.error("Error", {
        description: data.error,
      })
    })

    // Connect
    socket.connect()

    // Cleanup
    return () => {
      socket.off("connect")
      socket.off("connected")
      socket.off("disconnect")
      socket.off("connect_error")
      socket.off("ai:complete")
      socket.off("ai:progress")
      socket.off("pdf:complete")
      socket.off("pdf:progress")
      socket.off("error")
      socket.disconnect()
      socketRef.current = null
      disconnectResumeBuilderSocket()
    }
  }, [isAuthenticated, accessToken, queryClient])

  const value: ResumeBuilderSocketContextValue = {
    isConnected,
    connectionError,
    lastAIResult,
    clearAIResult,
  }

  return (
    <ResumeBuilderSocketContext.Provider value={value}>
      {children}
    </ResumeBuilderSocketContext.Provider>
  )
}
