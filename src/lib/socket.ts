import { io } from "socket.io-client"

// Use the same URL as the API but without /api suffix, or explicitly handle it
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
const SOCKET_URL = API_URL.replace(/\/api$/, "")

export const analysisSocket = io(`${SOCKET_URL}/analysis`, {
  autoConnect: false,
  transports: ["websocket"],
})
