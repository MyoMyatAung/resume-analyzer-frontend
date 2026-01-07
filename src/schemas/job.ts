import { z } from "zod"

export const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
})

export type JobFormData = z.infer<typeof jobSchema>
