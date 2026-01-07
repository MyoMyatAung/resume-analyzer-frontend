export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export const GOOGLE_OAUTH_URL = `${API_URL}/auth/google`
export const GITHUB_OAUTH_URL = `${API_URL}/auth/github`

export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const ALLOWED_FILE_TYPES = ["application/pdf"]

export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  RESUMES: "/resumes",
  RESUMES_UPLOAD: "/resumes/upload",
  RESUMES_DETAIL: (id: string) => `/resumes/${id}`,
  JOBS: "/jobs",
  JOBS_NEW: "/jobs/new",
  JOBS_DETAIL: (id: string) => `/jobs/${id}`,
  ANALYSIS: "/analysis",
  ANALYSIS_MATCH: "/analysis/match",
  ANALYSIS_QUALITY: "/analysis/quality",
  ANALYSIS_DETAIL: (id: string) => `/analysis/${id}`,
  PROFILE: "/profile",
  NOT_FOUND: "*",
}

export const QUERY_KEYS = {
  USER: ["user"],
  RESUMES: ["resumes"],
  RESUME: (id: string) => ["resumes", id],
  JOBS: ["jobs"],
  JOB: (id: string) => ["jobs", id],
  ANALYSIS: ["analysis"],
  MATCH_ANALYSIS: ["analysis", "match"],
  QUALITY_ANALYSIS: ["analysis", "quality"],
}
