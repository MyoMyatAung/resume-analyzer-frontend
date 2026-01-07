import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type { Resume, ResumeDetail, UploadResumeResponse } from "@/types/resume"
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants"

async function fetchResumes(): Promise<Resume[]> {
  const response = await api.get("/resumes")
  return response.data.data
}

async function fetchResume(id: string): Promise<ResumeDetail> {
  const response = await api.get(`/resumes/${id}`)
  return response.data.data
}

export function useResumes() {
  return useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: fetchResumes,
  })
}

export function useResume(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME(id),
    queryFn: () => fetchResume(id),
    enabled: !!id,
  })
}

export function useUploadResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File): Promise<UploadResumeResponse> => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size must be less than 5MB")
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error("Only PDF files are allowed")
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES })
    },
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/resumes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES })
    },
  })
}

export function useDownloadResume() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.get(`/resumes/${id}/download`)
      return response.data.data.url
    },
  })
}
