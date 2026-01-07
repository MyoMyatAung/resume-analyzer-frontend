export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface OAuthInitiateResponse {
  url: string
}

export interface OAuthCallbackData {
  user: User
  accessToken: string
  refreshToken: string
}

export interface OAuthError {
  error: string
  error_description?: string
  state?: string
}
