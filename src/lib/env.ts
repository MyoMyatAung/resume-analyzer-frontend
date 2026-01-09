export const env = {
  API_URL: import.meta.env.VITE_API_URL,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
  DEBUG: import.meta.env.VITE_DEBUG === "true",
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
} as const

export type Environment = typeof env
