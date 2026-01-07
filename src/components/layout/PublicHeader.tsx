import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/stores/useThemeStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { Moon, Sun } from "lucide-react"
import logo from "@/assets/logo.svg"

export default function PublicHeader() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()
  const { isAuthenticated } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Tanalyze" className="h-9 w-auto" />
            <span className="text-xl font-bold">Tanalyze</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {isAuthenticated ? (
            <Button onClick={() => navigate({ to: "/dashboard" })}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/login" })}>
                Sign In
              </Button>
              <Button onClick={() => navigate({ to: "/register" })}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
