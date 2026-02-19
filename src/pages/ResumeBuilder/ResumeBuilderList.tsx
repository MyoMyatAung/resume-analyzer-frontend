import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useGeneratedResumes, useDeleteResume, useDuplicateResume } from "@/hooks/useResumeBuilder"
import { useDownloadPDF } from "@/hooks/usePDFGeneration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Plus,
  FileText,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Download,
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react"
import type { ResumeListItem, PDFStatus } from "@/types/resume-builder"
import { ROUTES } from "@/lib/constants"

export function ResumeBuilderList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<ResumeListItem | null>(null)
  
  const { data, isLoading, error } = useGeneratedResumes()
  const deleteResume = useDeleteResume()
  const duplicateResume = useDuplicateResume()

  const handleDelete = async () => {
    if (!resumeToDelete) return
    
    try {
      await deleteResume.mutateAsync(resumeToDelete.id)
      toast.success("Resume deleted successfully")
      setDeleteDialogOpen(false)
      setResumeToDelete(null)
    } catch {
      toast.error("Failed to delete resume")
    }
  }

  const handleDuplicate = async (resume: ResumeListItem) => {
    try {
      await duplicateResume.mutateAsync(resume.id)
      toast.success("Resume duplicated successfully")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to duplicate resume")
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load resumes</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </main>
    )
  }

  const { data: resumes, meta } = data || { data: [], meta: { total: 0, canCreateMore: true, maxResumes: 3 } }

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your professional resumes ({meta.total}/{meta.maxResumes} resumes)
          </p>
        </div>
        <Button asChild disabled={!meta.canCreateMore}>
          <Link to={ROUTES.RESUME_BUILDER_NEW}>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Link>
        </Button>
      </div>

      {!meta.canCreateMore && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You've reached the maximum limit of {meta.maxResumes} resumes. Delete an existing resume to create a new one.
            </p>
          </div>
        </div>
      )}

      {resumes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No resumes yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first professional resume with our AI-powered builder.
            </p>
            <Button asChild>
              <Link to={ROUTES.RESUME_BUILDER_NEW}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDelete={() => {
                setResumeToDelete(resume)
                setDeleteDialogOpen(true)
              }}
              onDuplicate={() => handleDuplicate(resume)}
            />
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{resumeToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteResume.isPending}
            >
              {deleteResume.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

interface ResumeCardProps {
  resume: ResumeListItem
  onDelete: () => void
  onDuplicate: () => void
}

function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const downloadPDF = useDownloadPDF(resume.id)

  const handleDownload = async () => {
    try {
      const { downloadUrl, fileName } = await downloadPDF.mutateAsync()
      // Create a temporary link to trigger download
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      toast.error("Failed to download PDF")
    }
  }

  const pdfStatusBadge = getPDFStatusBadge(resume.pdfStatus, resume.isPDFExpired)

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{resume.title}</CardTitle>
            <CardDescription className="truncate">{resume.fullName}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={ROUTES.RESUME_BUILDER_EDIT(resume.id)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              {resume.pdfStatus === "COMPLETED" && !resume.isPDFExpired && (
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {pdfStatusBadge}
          <span className="text-xs text-muted-foreground">
            v{resume.version} • {new Date(resume.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-4">
          <Button asChild variant="outline" className="w-full">
            <Link to={ROUTES.RESUME_BUILDER_EDIT(resume.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Resume
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getPDFStatusBadge(status: PDFStatus, isExpired: boolean) {
  if (isExpired) {
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-600">
        <Clock className="mr-1 h-3 w-3" />
        PDF Expired
      </Badge>
    )
  }

  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="outline" className="text-green-600 border-green-600">
          <CheckCircle className="mr-1 h-3 w-3" />
          PDF Ready
        </Badge>
      )
    case "GENERATING":
    case "QUEUED":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Generating
        </Badge>
      )
    case "FAILED":
      return (
        <Badge variant="outline" className="text-destructive border-destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          PDF Failed
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <FileText className="mr-1 h-3 w-3" />
          No PDF
        </Badge>
      )
  }
}
