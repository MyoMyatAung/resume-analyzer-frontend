import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type {
  GeneratePDFRequest,
  GeneratePDFResponse,
  PDFStatusResponse,
  PDFDownloadResponse,
} from "@/types/resume-builder"

/**
 * Generate PDF for a resume
 */
export function useGeneratePDF(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data?: GeneratePDFRequest): Promise<GeneratePDFResponse> => {
      const response = await api.post(`/resume-builder/${resumeId}/generate-pdf`, data || {})
      return response.data
    },
    onSuccess: () => {
      // Invalidate to update PDF status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUME(resumeId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME_PDF_STATUS(resumeId) })
    },
  })
}

/**
 * Get PDF generation status
 */
export function usePDFStatus(resumeId: string | null, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME_PDF_STATUS(resumeId || ""),
    queryFn: async (): Promise<PDFStatusResponse> => {
      const response = await api.get(`/resume-builder/${resumeId}/pdf-status`)
      return response.data
    },
    enabled: !!resumeId,
    refetchInterval: options?.refetchInterval,
  })
}

/**
 * Get signed download URL for PDF
 */
export function useDownloadPDF(resumeId: string) {
  return useMutation({
    mutationFn: async (): Promise<PDFDownloadResponse> => {
      const response = await api.get(`/resume-builder/${resumeId}/download`)
      return response.data
    },
  })
}

/**
 * Hook to poll PDF status while generating
 */
export function usePDFStatusPolling(resumeId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME_PDF_STATUS(resumeId || ""),
    queryFn: async (): Promise<PDFStatusResponse> => {
      const response = await api.get(`/resume-builder/${resumeId}/pdf-status`)
      return response.data
    },
    enabled: !!resumeId,
    refetchInterval: (query) => {
      // Only poll while generating or queued
      const status = query.state.data?.status
      if (status === "QUEUED" || status === "GENERATING") {
        return 2000 // Poll every 2 seconds
      }
      return false // Stop polling
    },
  })
}
