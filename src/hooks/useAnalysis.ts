import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type {
  MatchAnalysisResult,
  QualityAnalysisResult,
  MatchAnalysisRequest,
  QualityAnalysisRequest,
  AnalysisListItem,
  AnalysisDetail,
} from "@/types/analysis"

export function useAnalyses() {
  return useQuery({
    queryKey: QUERY_KEYS.ANALYSIS,
    queryFn: async (): Promise<AnalysisListItem[]> => {
      const response = await api.get("/analysis")
      return response.data
    },
  })
}

export function useAnalysisDetail(analysisId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYSIS, analysisId],
    queryFn: async (): Promise<AnalysisDetail> => {
      const response = await api.get(`/analysis/status/${analysisId}`)
      return response.data
    },
    enabled: !!analysisId,
  })
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (analysisId: string): Promise<{ success: boolean; message: string }> => {
      const response = await api.delete(`/analysis/${analysisId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYSIS })
    },
  })
}

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

export function useAnalysisStatus(analysisId: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYSIS, analysisId],
    queryFn: async () => {
      const response = await api.get(`/analysis/status/${analysisId}`)
      return response.data
    },
    enabled: !!analysisId,
  })
}
