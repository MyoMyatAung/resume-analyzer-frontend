import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useResumes } from "@/hooks/useResumes"
import { useJobs } from "@/hooks/useJobs"
import { useMatchAnalysis, useQualityAnalysis, useAnalyses, useDeleteAnalysis } from "@/hooks/useAnalysis"
import { toast } from "sonner"
import { QUERY_KEYS } from "@/lib/constants"
import {
  Target,
  TrendingUp,
  Loader2,
  Trash2,
  ChevronRight,
  FileText,
  Briefcase,
  Clock,
  AlertCircle,
} from "lucide-react"
import type { Resume } from "@/types/resume"
import type { Job } from "@/types/job"
import type { AnalysisListItem } from "@/types/analysis"

export function Analysis() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: jobs, isLoading: jobsLoading } = useJobs()
  const { data: analyses, isLoading: analysesLoading } = useAnalyses()
  const matchAnalysis = useMatchAnalysis()
  const qualityAnalysis = useQualityAnalysis()
  const deleteAnalysis = useDeleteAnalysis()

  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [analysisType, setAnalysisType] = useState<"match" | "quality">("quality")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [analysisToDelete, setAnalysisToDelete] = useState<AnalysisListItem | null>(null)

  const handleMatchAnalysis = async () => {
    if (!selectedResumeId || !selectedJobId) return
    try {
      await matchAnalysis.mutateAsync({
        resumeId: selectedResumeId,
        jobId: selectedJobId,
      })
      // Invalidate queries to show the new processing item in the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYSIS })
      // Show toast notification
      toast.info("Analysis started", {
        description: "Your analysis is being processed. You'll be notified when it's complete.",
      })
      // Reset form
      setSelectedResumeId("")
      setSelectedJobId("")
    } catch (error) {
      console.error("Match analysis error:", error)
      toast.error("Failed to start analysis", {
        description: "Please try again.",
      })
    }
  }

  const handleQualityAnalysis = async () => {
    if (!selectedResumeId) return
    try {
      await qualityAnalysis.mutateAsync({
        resumeId: selectedResumeId,
      })
      // Invalidate queries to show the new processing item in the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYSIS })
      // Show toast notification
      toast.info("Analysis started", {
        description: "Your analysis is being processed. You'll be notified when it's complete.",
      })
      // Reset form
      setSelectedResumeId("")
    } catch (error) {
      console.error("Quality analysis error:", error)
      toast.error("Failed to start analysis", {
        description: "Please try again.",
      })
    }
  }

  const handleDeleteClick = (analysis: AnalysisListItem, e: React.MouseEvent) => {
    e.stopPropagation()
    setAnalysisToDelete(analysis)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!analysisToDelete) return
    try {
      await deleteAnalysis.mutateAsync(analysisToDelete.id)
      setDeleteDialogOpen(false)
      setAnalysisToDelete(null)
    } catch (error) {
      console.error("Delete analysis error:", error)
    }
  }

  const handleAnalysisClick = (analysis: AnalysisListItem) => {
    navigate({ to: "/analysis/$id", params: { id: analysis.id } })
  }

  const isFormLoading = resumesLoading || jobsLoading || matchAnalysis.isPending || qualityAnalysis.isPending

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "PROCESSING":
        return <Badge variant="secondary">Processing</Badge>
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  const getAnalysisTypeBadge = (analysis: AnalysisListItem) => {
    const isMatch = !!analysis.jobId
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        {isMatch ? <Target className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
        {isMatch ? "Match" : "Quality"}
      </Badge>
    )
  }

  const getScoreDisplay = (analysis: AnalysisListItem) => {
    if (analysis.status !== "COMPLETED") return null

    const isMatch = !!analysis.jobId
    const score = isMatch
      ? analysis.matchScore
      : analysis.qualityScores?.overall

    if (score === null || score === undefined) return null

    return (
      <div className="text-2xl font-bold text-primary">{Math.round(score)}%</div>
    )
  }

  const renderAnalysisHistory = () => {
    if (analysesLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (!analyses || analyses.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No analyses yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Run your first analysis to see results here
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-3">
        {analyses.map((analysis) => (
          <Card
            key={analysis.id}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleAnalysisClick(analysis)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Score */}
                <div className="w-16 h-16 flex items-center justify-center bg-muted/50 rounded-lg">
                  {analysis.status === "PROCESSING" ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : analysis.status === "FAILED" ? (
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  ) : (
                    getScoreDisplay(analysis)
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getAnalysisTypeBadge(analysis)}
                    {getStatusBadge(analysis.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{analysis.resume?.fileName || "Unknown Resume"}</span>
                  </div>
                  {analysis.job && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span className="truncate">{analysis.job.title} at {analysis.job.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(analysis.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleDeleteClick(analysis, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your resumes against job descriptions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Panel - Run Analysis Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Run Analysis</CardTitle>
              <CardDescription>
                Select a resume and analysis type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Resume</label>
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes?.map((resume: Resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                <Select
                  value={analysisType}
                  onValueChange={(value) => setAnalysisType(value as "match" | "quality")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Job Match Analysis
                      </div>
                    </SelectItem>
                    <SelectItem value="quality">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Quality Analysis
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {analysisType === "match" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Description</label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs?.map((job: Job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} at {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="w-full"
                disabled={isFormLoading || !selectedResumeId || (analysisType === "match" && !selectedJobId)}
                onClick={analysisType === "match" ? handleMatchAnalysis : handleQualityAnalysis}
              >
                {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isFormLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Analysis History */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Analysis History</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your past analyses
            </p>
          </div>
          {renderAnalysisHistory()}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Analysis</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this analysis? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {analysisToDelete && (
            <div className="py-4">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{analysisToDelete.resume?.fileName || "Unknown Resume"}</span>
              </div>
              {analysisToDelete.job && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{analysisToDelete.job.title} at {analysisToDelete.job.company}</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteAnalysis.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteAnalysis.isPending}
            >
              {deleteAnalysis.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
