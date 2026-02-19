import { io, Socket } from "socket.io-client"

// Use the same URL as the API but without /api suffix
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
const SOCKET_URL = API_URL.replace(/\/api$/, "")

// Create the resume builder socket with authentication
export function createResumeBuilderSocket(token: string): Socket {
  return io(`${SOCKET_URL}/resume-builder`, {
    autoConnect: false,
    transports: ["websocket"],
    auth: {
      token,
    },
  })
}

// Singleton instance for the socket
let resumeBuilderSocket: Socket | null = null

export function getResumeBuilderSocket(token: string): Socket {
  if (!resumeBuilderSocket) {
    resumeBuilderSocket = createResumeBuilderSocket(token)
  }
  return resumeBuilderSocket
}

export function disconnectResumeBuilderSocket(): void {
  if (resumeBuilderSocket) {
    resumeBuilderSocket.disconnect()
    resumeBuilderSocket = null
  }
}
