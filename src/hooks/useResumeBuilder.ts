import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type {
  GeneratedResume,
  ResumeListResponse,
  CreateResumeDto,
  UpdateResumeDto,
  UpdatePersonalInfoDto,
  UpdateSummaryDto,
  UpdateExperiencesDto,
  UpdateEducationDto,
  UpdateSkillsDto,
  UpdateProjectsDto,
  UpdateCertificationsDto,
  UpdateTemplateDto,
  ResumeTemplate,
} from "@/types/resume-builder"

// ==================== Resume CRUD Hooks ====================

/**
 * Fetch all generated resumes for the current user
 */
export function useGeneratedResumes(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...QUERY_KEYS.GENERATED_RESUMES, { page, limit }],
    queryFn: async (): Promise<ResumeListResponse> => {
      const response = await api.get("/resume-builder", {
        params: { page, limit },
      })
      return response.data
    },
  })
}

/**
 * Fetch a single generated resume by ID
 */
export function useGeneratedResume(resumeId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.GENERATED_RESUME(resumeId || ""),
    queryFn: async (): Promise<GeneratedResume> => {
      const response = await api.get(`/resume-builder/${resumeId}`)
      return response.data
    },
    enabled: !!resumeId,
  })
}

/**
 * Create a new generated resume
 */
export function useCreateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateResumeDto): Promise<GeneratedResume> => {
      const response = await api.post("/resume-builder", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUMES })
    },
  })
}

/**
 * Update an entire resume
 */
export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateResumeDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUMES })
    },
  })
}

/**
 * Delete a resume
 */
export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resumeId: string): Promise<{ message: string }> => {
      const response = await api.delete(`/resume-builder/${resumeId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUMES })
    },
  })
}

/**
 * Duplicate a resume
 */
export function useDuplicateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resumeId: string): Promise<GeneratedResume> => {
      const response = await api.post(`/resume-builder/${resumeId}/duplicate`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENERATED_RESUMES })
    },
  })
}

// ==================== Section Update Hooks ====================

/**
 * Update personal information section
 */
export function useUpdatePersonalInfo(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdatePersonalInfoDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/personal-info`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update summary section
 */
export function useUpdateSummary(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateSummaryDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/summary`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update experiences section
 */
export function useUpdateExperiences(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateExperiencesDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/experiences`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update education section
 */
export function useUpdateEducation(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateEducationDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/education`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update skills section
 */
export function useUpdateSkills(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateSkillsDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/skills`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update projects section
 */
export function useUpdateProjects(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProjectsDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/projects`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update certifications section
 */
export function useUpdateCertifications(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateCertificationsDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/certifications`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

/**
 * Update template
 */
export function useUpdateTemplate(resumeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateTemplateDto): Promise<GeneratedResume> => {
      const response = await api.patch(`/resume-builder/${resumeId}/template`, data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.GENERATED_RESUME(resumeId), data)
    },
  })
}

// ==================== Template Hooks ====================

/**
 * Fetch all available templates
 */
export function useResumeTemplates() {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME_TEMPLATES,
    queryFn: async (): Promise<ResumeTemplate[]> => {
      const response = await api.get("/resume-builder/templates")
      return (response.data as any).data
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour since templates rarely change
  })
}

/**
 * Fetch a single template by key
 */
export function useResumeTemplate(templateKey: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RESUME_TEMPLATES, templateKey],
    queryFn: async (): Promise<ResumeTemplate> => {
      const response = await api.get(`/resume-builder/templates/${templateKey}`)
      return response.data
    },
    enabled: !!templateKey,
    staleTime: 1000 * 60 * 60,
  })
}
