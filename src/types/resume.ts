export interface Resume {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  userId: string
}

export interface ResumeDetail extends Resume {
  extractedText?: string
  downloadUrl?: string
}

export interface UploadResumeResponse {
  id: string
  fileName: string
  fileSize: number
  uploadedAt: string
  message: string
}
