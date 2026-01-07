import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useResumes, useDeleteResume, useUploadResume } from "@/hooks/useResumes"
import { FileText, Upload, Trash2, Download, Loader2 } from "lucide-react"
import { formatDate, formatFileSize } from "@/lib/utils"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"
import type { Resume } from "@/types/resume"

export function Resumes() {
  const { data: resumes, isLoading } = useResumes()
  const deleteResume = useDeleteResume()
  const uploadResume = useUploadResume()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setUploadDialogOpen(true)
    } else {
      try {
        toast.error("Invalid file type", {
          description: "Please upload a PDF file.",
        })
      } catch {
        console.error("Failed to show toast")
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadDialogOpen(true)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    await uploadResume.mutateAsync(file, {
      onSuccess: () => {
        try {
          toast.success("Resume uploaded", {
            description: "Your resume has been uploaded successfully.",
          })
        } catch {
          console.error("Failed to show toast")
        }
        setUploadDialogOpen(false)
        setFile(null)
      },
    })
  }

  const handleDelete = () => {
    if (!selectedResume) return

    deleteResume.mutate(selectedResume.id, {
      onSuccess: () => {
        try {
          toast.success("Resume deleted", {
            description: "Your resume has been deleted.",
          })
        } catch {
          console.error("Failed to show toast")
        }
        setDeleteDialogOpen(false)
        setSelectedResume(null)
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Resumes</h1>
          <p className="text-muted-foreground mt-2">
            Manage your resumes and upload new ones
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Drag and drop your resume here</p>
        <p className="text-sm text-muted-foreground mt-1">
          or click the button below to browse files
        </p>
        <Input
          type="file"
          accept=".pdf"
          className="hidden"
          id="resume-upload"
          onChange={handleFileSelect}
        />
        <Button variant="outline" className="mt-4" asChild>
          <label htmlFor="resume-upload">Browse Files</label>
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : resumes && resumes.length > 0 ? (
        <div className="grid gap-4">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{resume.fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(resume.fileSize)} • Uploaded {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedResume(resume)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No resumes yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your first resume to get started
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              Upload a PDF resume (max 5MB)
            </DialogDescription>
          </DialogHeader>
          {file && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploadResume.isPending}
            >
              {uploadResume.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedResume?.fileName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
