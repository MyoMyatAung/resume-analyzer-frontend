export interface Feedback {
  id: string
  userId: string
  rating: number
  category: string
  comment: string
  createdAt: string
}

export interface CreateFeedbackData {
  rating: number
  category: string
  comment: string
}
