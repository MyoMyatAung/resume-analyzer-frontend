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
}

export interface MatchAnalysisRequest {
  resumeId: string
  jobId: string
}

export interface QualityAnalysisRequest {
  resumeId: string
}
