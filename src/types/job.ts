export interface Job {
  id: string
  title: string
  company: string
  location?: string
  salary?: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateJobData {
  title: string
  company: string
  location?: string
  salary?: string
  description: string
}

export interface UpdateJobData extends Partial<CreateJobData> {
  id: string
}
