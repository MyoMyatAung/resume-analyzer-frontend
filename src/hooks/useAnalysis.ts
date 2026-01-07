import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type {
  MatchAnalysisResult,
  QualityAnalysisResult,
  MatchAnalysisRequest,
  QualityAnalysisRequest,
} from "@/types/analysis"

export function useMatchAnalysis() {
  return useMutation({
    mutationFn: async (data: MatchAnalysisRequest): Promise<MatchAnalysisResult> => {
      const response = await api.post("/analysis/match", data)
      return response.data
    },
  })
}

export function useQualityAnalysis() {
  return useMutation({
    mutationFn: async (data: QualityAnalysisRequest): Promise<QualityAnalysisResult> => {
      const response = await api.post("/analysis/quality", data)
      return response.data
    },
  })
}

export function useMatchAnalysisResult(resumeId: string, jobId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.MATCH_ANALYSIS, resumeId, jobId],
    queryFn: async (): Promise<MatchAnalysisResult> => {
      const response = await api.post("/analysis/match", { resumeId, jobId })
      return response.data
    },
    enabled: !!resumeId && !!jobId,
    staleTime: 0,
  })
}

export function useQualityAnalysisResult(resumeId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.QUALITY_ANALYSIS, resumeId],
    queryFn: async (): Promise<QualityAnalysisResult> => {
      const response = await api.post("/analysis/quality", { resumeId })
      return response.data
    },
    enabled: !!resumeId,
    staleTime: 0,
  })
}
