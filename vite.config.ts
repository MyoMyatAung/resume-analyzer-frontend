import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Environment-specific configuration
  define: {
    __APP_ENV__: JSON.stringify(mode),
  },
}));
