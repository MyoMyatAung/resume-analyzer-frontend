// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "local"
export const DEBUG = import.meta.env.VITE_DEBUG === "true"

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || "Resume Analyzer"
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "1.0.0"

// OAuth URLs
export const GOOGLE_OAUTH_URL = `${API_URL}/auth/google`
export const GITHUB_OAUTH_URL = `${API_URL}/auth/github`

// File Upload
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
  RESUME_BUILDER: "/resume-builder",
  RESUME_BUILDER_NEW: "/resume-builder/new",
  RESUME_BUILDER_EDIT: (id: string) => `/resume-builder/${id}/edit`,
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
  GENERATED_RESUMES: ["generated-resumes"],
  GENERATED_RESUME: (id: string) => ["generated-resumes", id],
  RESUME_TEMPLATES: ["resume-templates"],
  RESUME_PDF_STATUS: (id: string) => ["generated-resumes", id, "pdf-status"],
}
