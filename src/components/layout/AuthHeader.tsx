import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { useThemeStore } from "@/stores/useThemeStore"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, LogOut, LayoutDashboard, Menu, FileText, Target, TrendingUp } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { FeedbackDialog } from "@/components/features/feedback/FeedbackDialog"
import logo from "@/assets/logo.svg"

export default function AuthHeader() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const logout = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Tanalyze" className="h-9 w-auto" />
            <span className="text-xl font-bold">Tanalyze</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              activeProps={{
                className: "text-primary font-medium",
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/resumes"
              activeProps={{
                className: "text-primary font-medium",
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Resumes
            </Link>
            <Link
              to="/jobs"
              activeProps={{
                className: "text-primary font-medium",
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/analysis"
              activeProps={{
                className: "text-primary font-medium",
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Analysis
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <FeedbackDialog />
          </div>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/resumes" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Resumes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/jobs" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Jobs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/analysis" className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analysis
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? getInitials(`${user.firstName} ${user.lastName}`) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
