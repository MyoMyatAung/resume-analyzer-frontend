import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
  GenerateSummaryRequest,
  EnhanceExperienceRequest,
  SuggestSkillsRequest,
  ImproveAchievementsRequest,
} from "@/types/resume-builder"

interface AIJobResponse {
  jobId: string
  status: string
  message: string
}

/**
 * Generate professional summary with AI
 * Note: AI endpoints don't use resumeId in the path - they're at /resume-builder/ai/*
 */
export function useGenerateSummary(_resumeId: string) {
  return useMutation({
    mutationFn: async (data: GenerateSummaryRequest): Promise<AIJobResponse> => {
      const response = await api.post(`/resume-builder/ai/generate-summary`, data)
      return response.data
    },
  })
}

/**
 * Enhance experience bullets with AI
 */
export function useEnhanceExperience(_resumeId: string) {
  return useMutation({
    mutationFn: async (data: EnhanceExperienceRequest): Promise<AIJobResponse> => {
      const response = await api.post(`/resume-builder/ai/enhance-experience`, data)
      return response.data
    },
  })
}

/**
 * Get skill suggestions with AI
 */
export function useSuggestSkills(_resumeId: string) {
  return useMutation({
    mutationFn: async (data: SuggestSkillsRequest): Promise<AIJobResponse> => {
      const response = await api.post(`/resume-builder/ai/suggest-skills`, data)
      return response.data
    },
  })
}

/**
 * Improve achievement statement with AI
 */
export function useImproveAchievements(_resumeId: string) {
  return useMutation({
    mutationFn: async (data: ImproveAchievementsRequest): Promise<AIJobResponse> => {
      const response = await api.post(`/resume-builder/ai/improve-achievements`, data)
      return response.data
    },
  })
}
