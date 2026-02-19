export interface QualityMetrics {
  skillCoverage: number
  experienceRelevance: number
  atsCompatibility: number
  clarityStructure: number
  overallScore: number
}

export interface GapAnalysis {
  missingSkills: string[]
  underrepresentedExperience: string[]
  weakKeywords: string[]
}

export interface Suggestions {
  resumeImprovement: string[]
  skillRecommendations: string[]
  keywordEnhancement: string[]
}

export interface QualityAnalysisResult {
  resumeId: string
  fileName: string
  quality: QualityMetrics
  gaps: GapAnalysis
  suggestions: Suggestions
  status?: string
  analysisId?: string
  message?: string
}

export interface MatchAnalysisResult {
  resumeId: string
  fileName: string
  jobId: string
  jobTitle: string
  company: string
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  experienceMatch: string
  recommendations: string
  summary: string
  quality: QualityMetrics
  gaps: GapAnalysis
  suggestions: Suggestions
  status?: string
  analysisId?: string
  message?: string
}

export interface MatchAnalysisRequest {
  resumeId?: string
  generatedResumeId?: string
  jobId: string
}

export interface QualityAnalysisRequest {
  resumeId?: string
  generatedResumeId?: string
}

export type AnalysisStatus = "PROCESSING" | "COMPLETED" | "FAILED"

export interface AnalysisListItem {
  id: string
  userId: string
  resumeId: string | null
  generatedResumeId: string | null
  jobId: string | null
  matchScore: number | null
  matchedSkills: string[]
  missingSkills: string[]
  experienceMatch: string | null
  recommendations: string | null
  summary: string | null
  status: AnalysisStatus
  error: string | null
  qualityScores: {
    overall: number
    ats: number
    clarity: number
    keyword: number
    skill: number
  } | null
  suggestions: {
    strengths: string[]
    improvements: string[]
    quickTips: string[]
  } | null
  gaps: unknown | null
  createdAt: string
  updatedAt: string
  resume: {
    id: string
    fileName: string
  } | null
  generatedResume: {
    id: string
    title: string
  } | null
  job: {
    id: string
    title: string
    company: string
  } | null
}

export interface AnalysisDetail extends AnalysisListItem {
  // Extended with same fields, kept for semantic clarity
}
