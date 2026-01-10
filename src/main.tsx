// import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { createRouter } from "@/router"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors (handled by interceptor)
        if (error?.response?.status === 401) {
          return false
        }
        // Don't retry on 403 errors
        if (error?.response?.status === 403) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
})

const router = createRouter({ context: { queryClient } })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
          <Toaster position="top-right" richColors closeButton />
          <RouterProvider router={router} />
        </ThemeProvider>
    </QueryClientProvider>
  // </StrictMode>
)
