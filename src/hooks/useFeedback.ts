import { useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { CreateFeedbackData } from "@/types/feedback"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function useCreateFeedback() {
  return useMutation({
    mutationFn: async (data: CreateFeedbackData) => {
      const response = await api.post("/feedback", data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || "Failed to submit feedback. Please try again."
      toast.error(message)
    },
  })
}
