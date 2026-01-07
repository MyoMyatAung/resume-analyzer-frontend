import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light" as Theme,

      setTheme: (theme) => {
        set({ theme })
        document.documentElement.classList.toggle("dark", theme === "dark")
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light"
        set({ theme: newTheme })
        document.documentElement.classList.toggle("dark", newTheme === "dark")
      },
    }),
    {
      name: "tanalyze-theme",
    }
  )
)
