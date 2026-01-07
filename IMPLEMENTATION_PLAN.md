# Tanalyze Frontend Implementation Plan

## Project Overview

**Tanalyze** is an AI-powered resume analysis and job matching platform. It enables users to upload resumes, create job descriptions, and receive AI-powered analysis with match scores, gap detection, and actionable recommendations.

### Core Value Proposition
"Optimize Your Resume. Match Better. Get Hired Faster."

### Target Users
- Job seekers looking to improve their resumes
- Professionals seeking to match against job requirements
- Users wanting ATS optimization insights

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 + Vite | Fast development and build performance |
| Language | TypeScript | Type safety and better developer experience |
| Routing | TanStack Router | Type-safe routing with loaders/actions |
| State Management | TanStack Query + Zustand | Server state + client state management |
| UI Components | shadcn/ui | Professional, accessible component library |
| Styling | Tailwind CSS | Utility-first styling with blue/purple palette |
| Forms | React Hook Form + Zod | Form handling with schema validation |
| HTTP Client | Axios | API requests with interceptors |
| Charts | Recharts | Data visualization for analysis results |
| Icons | Lucide React | Consistent icon set |

---

## Project Structure

```
src/
├── components/
│   ├── ui/                         # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── toast.tsx
│   │   ├── label.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── scroll-area.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx              # Navigation, dark mode toggle, user menu
│   │   ├── Footer.tsx              # Links, copyright, social
│   │   ├── Sidebar.tsx             # Navigation sidebar (desktop)
│   │   └── Layout.tsx              # Main layout wrapper
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx       # Email/password login form
│   │   │   ├── RegisterForm.tsx    # Registration form
│   │   │   ├── OAuthButtons.tsx    # Google + GitHub buttons
│   │   │   └── AuthCallback.tsx    # OAuth callback handler
│   │   ├── resumes/
│   │   │   ├── UploadZone.tsx      # Drag & drop upload area
│   │   │   ├── ResumeCard.tsx      # Resume summary card
│   │   │   ├── ResumeList.tsx      # List of user's resumes
│   │   │   ├── ResumeDetail.tsx    # Single resume view with actions
│   │   │   └── ResumeContext.tsx   # Resume state management
│   │   ├── jobs/
│   │   │   ├── JobForm.tsx         # Create/edit job form
│   │   │   ├── JobCard.tsx         # Job summary card
│   │   │   ├── JobList.tsx         # List of job descriptions
│   │   │   ├── JobDetail.tsx       # Single job view with actions
│   │   │   └── JobContext.tsx      # Job state management
│   │   ├── analysis/
│   │   │   ├── MatchResults.tsx    # Job matching results display
│   │   │   ├── QualityMetrics.tsx  # Quality analysis metrics
│   │   │   ├── GapAnalysis.tsx     # Missing skills and gaps
│   │   │   ├── ScoreChart.tsx      # Radar/bar charts for scores
│   │   │   └── AnalysisContext.tsx # Analysis state management
│   │   └── landing/
│   │       ├── Hero.tsx            # Main hero section
│   │       ├── TrustBar.tsx        # Social proof and stats
│   │       ├── Features.tsx        # Feature highlights grid
│   │       ├── HowItWorks.tsx      # Step-by-step guide
│   │       ├── FAQ.tsx             # Frequently asked questions
│   │       ├── Pricing.tsx         # Pricing tables
│   │       ├── CTASection.tsx      # Final call-to-action
│   │       └── LandingHeader.tsx   # Landing page header (non-auth)
│   └── shared/
│       ├── ProtectedRoute.tsx      # Route protection wrapper
│       ├── LoadingSpinner.tsx      # Full-page loading state
│       ├── LoadingSkeleton.tsx     # Component loading skeletons
│       ├── ErrorBoundary.tsx       # Error boundary wrapper
│       ├── EmptyState.tsx          # Empty state display
│       └── ConfirmDialog.tsx       # Confirmation dialog
├── hooks/
│   ├── useAuth.ts                  # Auth hooks (login, register, logout)
│   ├── useResumes.ts               # Resume CRUD hooks with React Query
│   ├── useJobs.ts                  # Job CRUD hooks with React Query
│   ├── useAnalysis.ts              # Analysis hooks with React Query
│   ├── useTheme.ts                 # Dark mode toggle hook
│   └── useDebounce.ts              # Debounce utility hook
├── lib/
│   ├── api.ts                      # Axios instance with interceptors
│   ├── auth.ts                     # Auth utilities (token management)
│   ├── constants.ts                # App constants
│   └── utils.ts                    # Utility functions (cn, format dates)
├── pages/
│   ├── Landing.tsx                 # Landing page composition
│   ├── Login.tsx                   # Login page
│   ├── Register.tsx                # Register page
│   ├── Dashboard.tsx               # User dashboard
│   ├── Resumes.tsx                 # Resumes management page
│   ├── Jobs.tsx                    # Jobs management page
│   ├── Analysis.tsx                # Analysis results page
│   ├── Profile.tsx                 # User profile page
│   └── NotFound.tsx                # 404 page
├── routes/
│   ├── root.tsx                    # Root route configuration
│   ├── authRoutes.tsx              # Auth-related routes
│   ├── protectedRoutes.tsx         # Protected route configuration
│   └── routeTree.tsx               # TanStack Router tree
├── stores/
│   ├── useAuthStore.ts             # Auth state (user, tokens, isAuthenticated)
│   └── useThemeStore.ts            # Theme state (dark mode, toggle)
├── types/
│   ├── api.ts                      # API response types
│   ├── auth.ts                     # Auth-related types
│   ├── resume.ts                   # Resume-related types
│   ├── job.ts                      # Job-related types
│   └── analysis.ts                 # Analysis-related types
├── App.tsx                         # App component
├── main.tsx                        # Entry point
├── index.css                       # Global styles + Tailwind imports
├── env.d.ts                        # Vite environment types
└── vite.config.ts                  # Vite configuration
```

---

## Routing Structure

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Landing | Marketing landing page |
| `/login` | Login | User login page |
| `/register` | Register | User registration page |
| `/auth/callback/google` | AuthCallback | Google OAuth callback |
| `/auth/callback/github` | AuthCallback | GitHub OAuth callback |

### Protected Routes (Require Authentication)

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | Dashboard | User dashboard with stats |
| `/resumes` | Resumes | Resume list and management |
| `/resumes/upload` | Resumes (with upload) | Upload new resume |
| `/resumes/:id` | ResumeDetail | View resume details |
| `/jobs` | Jobs | Job description list |
| `/jobs/new` | Jobs (with create) | Create new job |
| `/jobs/:id` | JobDetail | View job details |
| `/analysis` | Analysis | Analysis results list |
| `/analysis/match` | Analysis | Match resume to job |
| `/analysis/quality` | Analysis | Resume quality analysis |
| `/analysis/:id` | Analysis | View specific analysis |
| `/profile` | Profile | User profile settings |

### 404 Route

| Path | Component | Description |
|------|-----------|-------------|
| `*` | NotFound | 404 page for unmatched routes |

---

## API Integration

### Base URL

```
Development: http://localhost:3000/api
Production:  https://your-api-domain.com/api
```

### Axios Configuration

```typescript
// lib/api.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await useAuthStore.getState().refreshToken()
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
```

### API Endpoints Reference

#### Authentication

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register new user | `{firstName, lastName, email, password}` |
| POST | `/auth/login` | Login with credentials | `{email, password}` |
| POST | `/auth/refresh` | Refresh access token | `{refreshToken}` |
| GET | `/auth/google` | Initiate Google OAuth | - |
| GET | `/auth/github` | Initiate GitHub OAuth | - |
| GET | `/auth/me` | Get current user | - |

#### Users

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/users/profile` | Get user profile | - |
| PATCH | `/users/profile` | Update profile | `{firstName, lastName, email}` |
| PATCH | `/users/password` | Change password | `{currentPassword, newPassword}` |
| DELETE | `/users/account` | Delete account | - |

#### Resumes

| Method | Endpoint | Description | Content-Type |
|--------|----------|-------------|--------------|
| POST | `/resumes/upload` | Upload resume | `multipart/form-data` |
| GET | `/resumes` | List user resumes | - |
| GET | `/resumes/:id` | Get resume details | - |
| GET | `/resumes/:id/download` | Get download URL | - |
| DELETE | `/resumes/:id` | Delete resume | - |

#### Jobs

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/jobs` | Create job description | `{title, company, location, salary, description, requirements}` |
| GET | `/jobs` | List job descriptions | - |
| GET | `/jobs/:id` | Get job details | - |
| PATCH | `/jobs/:id` | Update job | `{title?, company?, ...}` |
| DELETE | `/jobs/:id` | Delete job | - |

#### Analysis

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/analysis/match` | Match resume to job | `{resumeId, jobId}` |
| POST | `/analysis/quality` | Analyze resume quality | `{resumeId}` |

---

## Form Handling with React Hook Form + Zod

### Validation Schemas

#### Login Form

```typescript
// schemas/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

#### Register Form

```typescript
export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>
```

#### Job Form

```typescript
export const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).optional(),
})

export type JobFormData = z.infer<typeof jobSchema>
```

#### Profile Update Form

```typescript
export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Please enter a valid email address'),
})

export type ProfileFormData = z.infer<typeof profileSchema>
```

#### Password Change Form

```typescript
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
```

### Form Component Pattern

```typescript
// Example: LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { loginSchema, type LoginFormData } from '@/schemas/auth'
import { useLogin } from '@/hooks/useAuth'

export function LoginForm() {
  const login = useLogin()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data)
    } catch (error) {
      // Handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
```

---

## OAuth Configuration

### Redirect URIs

#### Development
```
http://localhost:5173/auth/callback/google
http://localhost:5173/auth/callback/github
```

#### Production
```
https://tanalyze.com/auth/callback/google
https://tanalyze.com/auth/callback/github
```

### OAuth Button Component

```typescript
// components/features/auth/OAuthButtons.tsx
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function OAuthButtons() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={handleGoogleLogin}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
      <Button variant="outline" onClick={handleGithubLogin}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
}
```

---

## SEO Strategy

### HTML Meta Tags

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>Tanalyze - AI-Powered Resume Analysis & Job Matching</title>
    <meta name="description" content="Optimize your resume, match better with jobs, and get hired faster. Free AI-powered resume analysis using Google Gemini. ATS optimization and job matching.">
    <meta name="keywords" content="resume analysis, AI resume checker, job matching, ATS optimization, resume improvement, free resume analysis, resume scorer, job application tool">
    <meta name="author" content="Tanalyze">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://tanalyze.com">
    
    <!-- Open Graph / Social -->
    <meta property="og:title" content="Tanalyze - AI-Powered Resume Analysis & Job Matching">
    <meta property="og:description" content="Optimize Your Resume. Match Better. Get Hired Faster.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tanalyze.com">
    <meta property="og:image" content="https://tanalyze.com/og-image.jpg">
    <meta property="og:site_name" content="Tanalyze">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Tanalyze - AI-Powered Resume Analysis">
    <meta name="twitter:description" content="Optimize Your Resume. Match Better. Get Hired Faster.">
    <meta name="twitter:image" content="https://tanalyze.com/twitter-image.jpg">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Schema.org Structured Data (FAQ)

```typescript
// components/features/landing/FAQ.tsx
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Tanalyze really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Tanalyze offers core features for free using Google Gemini\'s free tier. You can upload unlimited resumes, get quality analysis, and match against job descriptions without paying.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, we support PDF files only, with a maximum size of 5MB. This ensures optimal text extraction and compatibility with our AI analysis.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI analysis work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tanalyze uses Google Gemini 1.5 Flash, a powerful AI model, to analyze your resume. It evaluates skill coverage, experience relevance, ATS compatibility, and clarity structure to provide actionable insights.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, your data is secure. Resumes are stored in AWS S3 with encryption, and we follow industry best practices for token management and data protection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I analyze my resume without a job description?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! You can use our standalone Resume Quality Analysis feature to get detailed feedback on your resume without needing a specific job description.',
      },
    },
  ],
}
```

---

## Landing Page Content

### Hero Section

**Headline:** "Optimize Your Resume. Match Better. Get Hired Faster."

**Subheadline:** "An AI-powered platform to analyze resume quality, match against job descriptions, and get actionable recommendations—completely free."

**CTAs:**
- Primary: "Get Started Free" → `/register`
- Secondary: "Sign In" → `/login`

**Visual:** Hero illustration showing resume analysis in progress

---

### Trust Bar

**Text:** "Trusted by 10,000+ job seekers worldwide"

**Stats:**
- 50,000+ resumes analyzed
- 2 million+ job matches made
- 95% user satisfaction

---

### Features Section

| Icon | Title | Description |
|------|-------|-------------|
| 🎯 | AI Resume Analysis | Get instant feedback on skill coverage, ATS compatibility, and clarity structure with detailed metrics |
| 🔍 | Smart Job Matching | Compare your resume against job postings to see your match score and identify opportunities |
| 📊 | Gap Detection | Know exactly what skills and keywords you're missing with actionable improvement suggestions |
| ✅ | ATS Optimization | Pass applicant tracking systems with keyword optimization and formatting recommendations |

---

### How It Works

1. **Upload Your Resume**
   - Drag and drop your PDF resume (max 5MB)
   - Automatic text extraction begins immediately

2. **Add a Job Description**
   - Paste a job posting directly
   - Or create a job description manually

3. **Get AI Insights**
   - Receive match scores and quality metrics
   - Get actionable gap analysis and recommendations

---

### FAQ Section

| Question | Answer |
|----------|--------|
| **Is Tanalyze really free?** | Yes, core features are free using Google Gemini's free tier. |
| **What file formats are supported?** | PDF only, up to 5MB per file. |
| **How does AI analysis work?** | Powered by Google Gemini 1.5 Flash for accurate insights. |
| **Is my data secure?** | Yes, AWS S3 storage with secure token handling. |
| **Can I analyze without a job description?** | Yes, quality analysis is available standalone. |

---

### Pricing Section

| Free Tier | Pro Tier |
|-----------|----------|
| Unlimited resume uploads | Priority AI processing |
| Resume quality analysis | Unlimited job matches |
| Basic job matching | Advanced insights export |
| 100 API requests/day | Dedicated support |
| Community access | Early access to new features |
| **$0/month** | **$9.99/month** |

**CTA:** "Upgrade to Pro" (links to signup with Pro plan)

---

### CTA Section

**Headline:** "Ready to supercharge your job search?"

**Subhead:** "Join thousands of job seekers who have improved their resumes and landed more interviews."

**CTAs:**
- "Upload Your Resume Now" → `/register`
- "Sign Up with Google/GitHub" → OAuth flow

---

### Footer

**Sections:**
- **Product:** Features, Pricing, API, Integrations
- **Company:** About, Blog, Careers, Press
- **Legal:** Privacy Policy, Terms of Service, Cookie Policy
- **Support:** Help Center, Contact Us, FAQ

**Social Links:** Twitter, LinkedIn, GitHub

**Copyright:** © 2024 Tanalyze. All rights reserved.

---

## Dark Mode Implementation

### Theme Store

```typescript
// stores/useThemeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      },
    }),
    {
      name: 'tanalyze-theme',
    }
  )
)
```

### Theme Provider

```typescript
// components/providers/ThemeProvider.tsx
import { useEffect } from 'react'
import { useThemeStore } from '@/stores/useThemeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return children
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
      },
    },
  },
  plugins: [],
}
```

---

## Analysis Results Display

### Quality Metrics (Radar Chart)

```typescript
// components/features/analysis/QualityMetrics.tsx
interface QualityMetrics {
  skillCoverage: number        // 0-100
  experienceRelevance: number  // 0-100
  atsCompatibility: number     // 0-100
  clarityStructure: number     // 0-100
  overallScore: number         // 0-100 (weighted average)
}

export function QualityMetrics({ metrics }: { metrics: QualityMetrics }) {
  const data = [
    { metric: 'Skill Coverage', value: metrics.skillCoverage },
    { metric: 'Experience Relevance', value: metrics.experienceRelevance },
    { metric: 'ATS Compatibility', value: metrics.atsCompatibility },
    { metric: 'Clarity & Structure', value: metrics.clarityStructure },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="text-4xl font-bold text-primary">{metrics.overallScore}</div>
        <div className="text-lg text-muted-foreground ml-1">/100</div>
      </div>
      <RadarChart data={data} />
    </div>
  )
}
```

### Match Results

```typescript
// components/features/analysis/MatchResults.tsx
interface MatchResult {
  matchScore: number                    // 0-100
  matchedSkills: string[]
  missingSkills: string[]
  experienceMatch: string
  recommendations: string
  summary: string
}

export function MatchResults({ result }: { result: MatchResult }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold text-primary">{result.matchScore}%</div>
        <div className="text-muted-foreground">Match Score</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Matched Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.matchedSkills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Missing Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill) => (
                <Badge key={skill} variant="destructive">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.summary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# OAuth Credentials (get from Google Cloud Console and GitHub Developer Settings)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GITHUB_CLIENT_ID=your_github_client_id

# App Configuration
VITE_APP_NAME=Tanalyze
VITE_APP_URL=http://localhost:5173
```

---

## Implementation Phases

### Phase 1: Foundation (1-2 hours)

1. Initialize Vite project with React + TypeScript
2. Install and configure Tailwind CSS
3. Install shadcn/ui and initialize components
4. Install TanStack Router + Query + Zustand
5. Install react-hook-form + zod + @hookform/resolvers
6. Configure ESLint and Prettier
7. Set up project folder structure
8. Create base environment configuration

### Phase 2: Infrastructure (1-2 hours)

1. Configure axios API client with interceptors
2. Set up TanStack Router with route tree
3. Create Auth store (Zustand) for tokens and user state
4. Implement ProtectedRoute wrapper component
5. Set up Theme provider with dark mode
6. Create global toast notification system
7. Set up React Query provider

### Phase 3: Landing Page (2-3 hours)

1. Create Landing.tsx page composition
2. Build Hero.tsx with SEO meta tags injection
3. Implement TrustBar.tsx with stats
4. Create Features.tsx with feature cards
5. Build HowItWorks.tsx with step-by-step guide
6. Implement FAQ.tsx with Schema.org structured data
7. Create Pricing.tsx with pricing tables
8. Build CTASection.tsx with final CTA
9. Implement LandingHeader.tsx and Footer.tsx
10. Test all sections for responsiveness

### Phase 4: Authentication (1-2 hours)

1. Build Login.tsx page with form
2. Create Register.tsx page with form
3. Implement LoginForm.tsx with react-hook-form + zod
4. Create RegisterForm.tsx with validation
5. Build OAuthButtons.tsx with redirect URIs
6. Implement AuthCallback.tsx for OAuth handling
7. Add toast notifications for errors/success
8. Handle 401 responses with token refresh
9. Test all auth flows

### Phase 5: Dashboard (1 hour)

1. Build Dashboard.tsx layout
2. Create stats cards (resumes, jobs, analyses counts)
3. Implement recent activity feed
4. Add quick action buttons (upload, create, analyze)
5. Add welcome message with user name
6. Test dashboard responsiveness

### Phase 6: Resume Management (2 hours)

1. Build UploadZone.tsx with drag & drop
2. Create file validation (PDF, 5MB max)
3. Implement upload progress indicator
4. Build ResumeCard.tsx for display
5. Create ResumeList.tsx with filtering
6. Implement ResumeDetail.tsx view
7. Add delete functionality with confirmation
8. Test upload flow and progress

### Phase 7: Job Management (2 hours)

1. Build JobForm.tsx with react-hook-form + zod
2. Create form validation (required fields)
3. Implement JobCard.tsx for display
4. Build JobList.tsx with filter/sort
5. Create JobDetail.tsx view
6. Add CRUD operations (create, read, update, delete)
7. Test job management flow

### Phase 8: Analysis Features (2-3 hours)

1. Create QualityMetrics.tsx with radar chart
2. Build MatchResults.tsx with progress bar
3. Implement GapAnalysis.tsx with suggestions
4. Create ScoreChart.tsx using Recharts
5. Build analysis selection flow (select resume, select job)
6. Implement both match and quality analysis views
7. Add export/print functionality
8. Test analysis display

### Phase 9: Polish (2 hours)

1. Implement dark mode toggle in Header
2. Add loading skeletons for all pages
3. Configure toast notifications globally
4. Add error boundaries
5. Ensure mobile responsiveness
6. Add hover/focus states for accessibility
7. Test dark mode persistence
8. Verify all ARIA labels

### Phase 10: Final Review (1-2 hours)

1. Test all authentication flows
2. Verify all API integrations
3. Check dark mode toggle persistence
4. Test file upload with progress
5. Validate forms with Zod
6. Run ESLint and fix errors
7. Run TypeScript typecheck
8. Build and verify production build
9. Final cross-browser testing

---

## Estimated Timeline

| Phase | Duration |
|-------|----------|
| Foundation | 1-2 hours |
| Infrastructure | 1-2 hours |
| Landing Page | 2-3 hours |
| Authentication | 1-2 hours |
| Dashboard | 1 hour |
| Resume Management | 2 hours |
| Job Management | 2 hours |
| Analysis Features | 2-3 hours |
| Polish | 2 hours |
| Final Review | 1-2 hours |
| **Total** | **15-21 hours** |

---

## Success Criteria

### Functional Requirements
- [ ] User can register and login with email/password
- [ ] User can login with Google or GitHub OAuth
- [ ] User can upload PDF resumes (max 5MB) with progress
- [ ] User can create, view, edit, delete job descriptions
- [ ] User can run quality analysis on resumes
- [ ] User can match resumes against job descriptions
- [ ] User can view match scores and gap analysis
- [ ] Dark mode toggle works and persists

### Non-Functional Requirements
- [ ] All pages load within 2 seconds
- [ ] Forms validate with clear error messages
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] Accessible with keyboard navigation
- [ ] SEO meta tags present on landing page
- [ ] No console errors in development

### Quality Metrics
- [ ] Lighthouse accessibility score > 90
- [ ] Lighthouse performance score > 80
- [ ] Lighthouse SEO score > 90
- [ ] TypeScript strict mode passes
- [ ] ESLint passes with no warnings

---

## Next Steps

1. **Initialize project** - Create Vite + React + TypeScript project
2. **Install dependencies** - Tailwind, shadcn/ui, TanStack, react-hook-form, zod
3. **Configure base** - Set up ESLint, Prettier, TypeScript, Tailwind
4. **Build infrastructure** - API client, Router, Stores, Providers
5. **Implement landing page** - Full SEO-optimized landing page
6. **Build authentication** - Login, Register, OAuth flows
7. **Create core features** - Resumes, Jobs, Analysis
8. **Polish and test** - Dark mode, responsive, accessibility, testing

---

**Document Version:** 1.0
**Last Updated:** January 4, 2026
**Project:** Tanalyze Frontend
