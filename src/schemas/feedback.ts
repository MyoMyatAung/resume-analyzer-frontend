import { z } from "zod"

export const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  category: z.string().min(1, "Please select a category"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment cannot exceed 500 characters"),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>
