// Resume Builder Types

// PDF Status enum
export type PDFStatus = 'NOT_GENERATED' | 'QUEUED' | 'GENERATING' | 'COMPLETED' | 'FAILED'

// Experience item - aligned with backend ExperienceItemDto
export interface ExperienceItem {
  id: string
  company: string
  position: string  // Backend uses 'position' not 'jobTitle'
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean  // Backend uses 'isCurrent' not 'current'
  description?: string  // Backend uses 'description' for general text
  achievements: string[]  // Required array of achievements/bullet points
  technologies?: string[]  // Technologies used
}

// Education item - aligned with backend EducationItemDto
export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string  // Field of study (required)
  location?: string
  startDate: string  // Start date (required)
  endDate?: string  // End date (was 'graduationDate')
  gpa?: string
  honors?: string
  achievements?: string[]  // Achievements
}

// Skills data
export interface SkillsData {
  technical: string[]
  soft: string[]
  languages?: string[]
  certifications?: string[]
}

// Project item
export interface ProjectItem {
  id?: string
  name: string
  description: string
  technologies: string[]
  link?: string
  highlights?: string[]
}

// Certification item - aligned with backend CertificationItemDto
export interface CertificationItem {
  id: string
  name: string
  issuer: string
  issueDate: string  // Backend uses 'issueDate' not 'date'
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string  // Backend uses 'credentialUrl' not 'url'
}

// Full resume data
export interface ResumeData {
  fullName: string
  targetTitle?: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
  experiences: ExperienceItem[]
  education: EducationItem[]
  skills: SkillsData
  projects: ProjectItem[]
  certifications: CertificationItem[]
}

// Generated resume (from API)
export interface GeneratedResume {
  id: string
  title: string
  templateId: string
  fullName: string
  targetTitle?: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
  experiences: ExperienceItem[]
  education: EducationItem[]
  skills: SkillsData
  projects: ProjectItem[]
  certifications: CertificationItem[]
  pdfStatus: PDFStatus
  pdfUrl?: string
  pdfKey?: string
  pdfGeneratedAt?: string
  pdfExpiresAt?: string
  pdfError?: string
  isPDFExpired: boolean
  version: number
  createdAt: string
  updatedAt: string
}

// Resume list item (lighter version for list view)
export interface ResumeListItem {
  id: string
  title: string
  templateId: string
  fullName: string
  email: string
  pdfStatus: PDFStatus
  pdfUrl?: string
  pdfExpiresAt?: string
  isPDFExpired: boolean
  version: number
  createdAt: string
  updatedAt: string
}

// Resume list response with pagination
export interface ResumeListResponse {
  data: ResumeListItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    canCreateMore: boolean
    maxResumes: number
  }
}

// Template
export interface ResumeTemplate {
  id: string
  templateKey: string
  name: string
  description: string
  previewUrl?: string
  isActive: boolean
}

// Create resume DTO
export interface CreateResumeDto {
  title: string
  templateId: string
  fullName: string
  targetTitle?: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
  experiences?: ExperienceItem[]
  education?: EducationItem[]
  skills?: SkillsData
  projects?: ProjectItem[]
  certifications?: CertificationItem[]
}

// Update resume DTO
export interface UpdateResumeDto {
  title?: string
  templateId?: string
  fullName?: string
  targetTitle?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  summary?: string
  experiences?: ExperienceItem[]
  education?: EducationItem[]
  skills?: SkillsData
  projects?: ProjectItem[]
  certifications?: CertificationItem[]
}

// Section-specific update DTOs
export interface UpdatePersonalInfoDto {
  fullName?: string
  targetTitle?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface UpdateSummaryDto {
  summary: string
}

export interface UpdateExperiencesDto {
  experiences: ExperienceItem[]
}

export interface UpdateEducationDto {
  education: EducationItem[]
}

export interface UpdateSkillsDto {
  skills: SkillsData
}

export interface UpdateProjectsDto {
  projects: ProjectItem[]
}

export interface UpdateCertificationsDto {
  certifications: CertificationItem[]
}

export interface UpdateTemplateDto {
  templateId: string
}

// AI Content Generation Types
export type AIContentType = 'generate-summary' | 'enhance-experience' | 'suggest-skills' | 'improve-achievements'

// AI Context for generation
export interface AIContextDto {
  targetRole?: string
  targetCompany?: string
  industry?: string
}

// Backend expects experiences array for generate-summary
export interface GenerateSummaryRequest {
  experiences: ExperienceItem[]
  educationJson?: string
  context?: AIContextDto
}

// Backend expects a single experience object
export interface EnhanceExperienceRequest {
  experience: ExperienceItem
  context?: AIContextDto
}

// Backend expects experiences array and existingSkillsJson string
export interface SuggestSkillsRequest {
  experiences: ExperienceItem[]
  existingSkillsJson?: string
  context?: AIContextDto
}

// Backend expects achievements array and jobContext string
export interface ImproveAchievementsRequest {
  achievements: string[]
  jobContext?: string
  context?: AIContextDto
}

// AI Content Generation Results
export interface GenerateSummaryResult {
  summary: string
  alternativeSummaries: string[]
}

export interface EnhanceExperienceResult {
  enhancedResponsibilities: string[]
  suggestedAchievements: string[]
  impactMetricsSuggestions: string[]
}

export interface SuggestSkillsResult {
  technicalSkills: string[]
  softSkills: string[]
  emergingSkills: string[]
  certificationSuggestions: string[]
}

export interface ImproveAchievementsResult {
  improvedAchievement: string
  alternatives: string[]
  tips: string[]
}

export type AIContentResult =
  | GenerateSummaryResult
  | EnhanceExperienceResult
  | SuggestSkillsResult
  | ImproveAchievementsResult

// PDF Generation
export interface GeneratePDFRequest {
  templateId?: string
}

export interface GeneratePDFResponse {
  jobId: string
  status: string
  message: string
}

export interface PDFStatusResponse {
  status: PDFStatus
  pdfUrl?: string
  pdfGeneratedAt?: string
  pdfExpiresAt?: string
  isPDFExpired: boolean
  error?: string
}

export interface PDFDownloadResponse {
  downloadUrl: string
  fileName: string
  expiresAt?: string
}

// WebSocket Events
export interface AICompleteEvent {
  jobId: string
  contentType: AIContentType
  result: AIContentResult
  timestamp: string
}

export interface AIProgressEvent {
  jobId: string
  message: string
  timestamp: string
}

export interface PDFCompleteEvent {
  resumeId: string
  pdfUrl: string
  status: 'completed'
  timestamp: string
}

export interface PDFProgressEvent {
  resumeId: string
  status: string
  timestamp: string
}

export interface ErrorEvent {
  error: string
  timestamp: string
}

// Form step type for multi-step form
export type FormStep =
  | 'personal-info'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'preview'

export const FORM_STEPS: { key: FormStep; label: string }[] = [
  { key: 'personal-info', label: 'Personal Info' },
  { key: 'summary', label: 'Summary' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'preview', label: 'Preview' },
]

// Default values
export const DEFAULT_SKILLS: SkillsData = {
  technical: [],
  soft: [],
  languages: [],
  certifications: [],
}

export const DEFAULT_RESUME_DATA: Partial<ResumeData> = {
  fullName: '',
  targetTitle: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
  experiences: [],
  education: [],
  skills: DEFAULT_SKILLS,
  projects: [],
  certifications: [],
}
