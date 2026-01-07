import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { QUERY_KEYS } from "@/lib/constants"
import type { Job, CreateJobData, UpdateJobData } from "@/types/job"

async function fetchJobs(): Promise<Job[]> {
  const response = await api.get("/jobs")
  return response.data.data
}

async function fetchJob(id: string): Promise<Job> {
  const response = await api.get(`/jobs/${id}`)
  return response.data.data
}

export function useJobs() {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS,
    queryFn: fetchJobs,
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.JOB(id),
    queryFn: () => fetchJob(id),
    enabled: !!id,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateJobData) => {
      const response = await api.post("/jobs", data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS })
    },
  })
}

export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateJobData) => {
      const response = await api.patch(`/jobs/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOB(variables.id) })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.JOBS })
    },
  })
}
