import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import type { GeneratedResume, PDFStatus } from "@/types/resume-builder"
import { useGeneratePDF, usePDFStatus, useDownloadPDF } from "@/hooks/usePDFGeneration"
import { useEffect } from "react"
import { renderResume } from "@/lib/templates"

interface ResumePreviewProps {
  resume: GeneratedResume
  onPrev: () => void
  isSaving: boolean
}

const StatusBadge = ({ status }: { status: PDFStatus }) => {
  const config: Record<PDFStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    NOT_GENERATED: { label: "Not Generated", variant: "outline", icon: <FileText className="h-3 w-3" /> },
    QUEUED: { label: "Queued", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
    GENERATING: { label: "Generating...", variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    COMPLETED: { label: "Ready", variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
    FAILED: { label: "Failed", variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
  }

  const { label, variant, icon } = config[status]

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {icon}
      {label}
    </Badge>
  )
}

export function ResumePreview({ resume, onPrev }: ResumePreviewProps) {
  const generatePDFMutation = useGeneratePDF(resume.id)
  const downloadPDFMutation = useDownloadPDF(resume.id)
  const { data: pdfStatusData, refetch: refetchStatus } = usePDFStatus(resume.id)

  const currentStatus = pdfStatusData?.status || resume.pdfStatus
  const pdfUrl = pdfStatusData?.pdfUrl || resume.pdfUrl

  // Refetch status periodically when generating
  useEffect(() => {
    if (currentStatus === "QUEUED" || currentStatus === "GENERATING") {
      const interval = setInterval(() => {
        refetchStatus()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [currentStatus, refetchStatus])

  const handleGeneratePDF = async () => {
    try {
      await generatePDFMutation.mutateAsync({})
      refetchStatus()
    } catch (error) {
      console.error("Failed to generate PDF:", error)
    }
  }

  const handleDownload = async () => {
    try {
      const result = await downloadPDFMutation.mutateAsync()
      window.open(result.downloadUrl, "_blank")
    } catch (error) {
      console.error("Failed to download PDF:", error)
    }
  }

  const isGenerating = currentStatus === "QUEUED" || currentStatus === "GENERATING"
  const canDownload = currentStatus === "COMPLETED" && pdfUrl

  return (
    <div className="space-y-6">
      {/* PDF Generation Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Generate PDF</CardTitle>
              <CardDescription>
                Generate a professional PDF of your resume.
              </CardDescription>
            </div>
            <StatusBadge status={currentStatus} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating || generatePDFMutation.isPending}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {currentStatus === "COMPLETED" ? "Regenerate PDF" : "Generate PDF"}
                </>
              )}
            </Button>
            {canDownload && (
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={downloadPDFMutation.isPending}
              >
                {downloadPDFMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download PDF
              </Button>
            )}
          </div>
          {currentStatus === "FAILED" && resume.pdfError && (
            <p className="text-sm text-destructive mt-2">{resume.pdfError}</p>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Preview</CardTitle>
          <CardDescription>
            Review your resume before generating the PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg bg-gray-100 overflow-hidden">
            <div className="bg-white shadow-inner max-w-[8.5in] mx-auto min-h-[11in]">
              <iframe
                title="Resume Preview"
                srcDoc={renderResume(resume, resume.templateId)}
                className="w-full min-h-[11in] border-none"
                style={{ height: 'auto', minHeight: '11.6in' }}
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrev}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Edit
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePDF}
                disabled={isGenerating || generatePDFMutation.isPending}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </Button>
              {canDownload && (
                <Button
                  variant="secondary"
                  onClick={handleDownload}
                  disabled={downloadPDFMutation.isPending}
                >
                  {downloadPDFMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
