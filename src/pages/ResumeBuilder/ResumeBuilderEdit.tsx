import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useGeneratedResume, useUpdateResume } from "@/hooks/useResumeBuilder"
import { useGeneratePDF, usePDFStatusPolling } from "@/hooks/usePDFGeneration"
import { useResumeBuilderSocket } from "@/components/providers/ResumeBuilderSocketProvider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  ArrowLeft,
  FileDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  WifiOff,
} from "lucide-react"
import { ROUTES } from "@/lib/constants"
import type { FormStep, GeneratedResume, UpdateResumeDto } from "@/types/resume-builder"
import { FORM_STEPS } from "@/types/resume-builder"
import { cn } from "@/lib/utils"

// Form section components
import { PersonalInfoForm } from "@/components/features/resume-builder/forms/PersonalInfoForm"
import { SummaryForm } from "@/components/features/resume-builder/forms/SummaryForm"
import { ExperienceForm } from "@/components/features/resume-builder/forms/ExperienceForm"
import { EducationForm } from "@/components/features/resume-builder/forms/EducationForm"
import { SkillsForm } from "@/components/features/resume-builder/forms/SkillsForm"
import { ProjectsForm } from "@/components/features/resume-builder/forms/ProjectsForm"
import { CertificationsForm } from "@/components/features/resume-builder/forms/CertificationsForm"
import { ResumePreview } from "@/components/features/resume-builder/preview/ResumePreview"
import { MiniResumePreview } from "@/components/features/resume-builder/preview/MiniResumePreview"

interface ResumeBuilderEditProps {
  resumeId: string
}

export function ResumeBuilderEdit({ resumeId }: ResumeBuilderEditProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<FormStep>("personal-info")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { data: resume, isLoading, error } = useGeneratedResume(resumeId)
  const updateResume = useUpdateResume(resumeId)
  const generatePDF = useGeneratePDF(resumeId)
  const { data: pdfStatus } = usePDFStatusPolling(resumeId)
  const { isConnected, connectionError } = useResumeBuilderSocket()

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSave = async (data: UpdateResumeDto) => {
    try {
      await updateResume.mutateAsync(data)
      setHasUnsavedChanges(false)
      toast.success("Changes saved")
    } catch {
      toast.error("Failed to save changes")
    }
  }

  const handleGeneratePDF = async () => {
    try {
      await generatePDF.mutateAsync({})
      toast.success("PDF generation started", {
        description: "You'll be notified when it's ready.",
      })
    } catch {
      toast.error("Failed to start PDF generation")
    }
  }

  const currentStepIndex = FORM_STEPS.findIndex((s) => s.key === currentStep)

  const goToNextStep = () => {
    if (currentStepIndex < FORM_STEPS.length - 1) {
      setCurrentStep(FORM_STEPS[currentStepIndex + 1].key)
    }
  }

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(FORM_STEPS[currentStepIndex - 1].key)
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !resume) {
    return (
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
          <p className="text-muted-foreground mb-4">
            The resume you're looking for doesn't exist or you don't have access.
          </p>
          <Button onClick={() => navigate({ to: ROUTES.RESUME_BUILDER })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resumes
          </Button>
        </div>
      </main>
    )
  }

  const isPDFGenerating = pdfStatus?.status === "QUEUED" || pdfStatus?.status === "GENERATING"

  return (
    <main className="flex-1 container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate({ to: ROUTES.RESUME_BUILDER })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{resume.title}</h1>
            <p className="text-sm text-muted-foreground">
              v{resume.version} • Last saved {new Date(resume.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection status */}
          {connectionError ? (
            <div className="flex items-center gap-1 text-amber-600 text-sm">
              <WifiOff className="h-4 w-4" />
              <span>Offline</span>
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Connected</span>
            </div>
          ) : null}

          <Button
            variant="outline"
            onClick={handleGeneratePDF}
            disabled={isPDFGenerating}
          >
            {isPDFGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {FORM_STEPS.map((step, index) => (
            <button
              key={step.key}
              onClick={() => setCurrentStep(step.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                currentStep === step.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {index + 1}. {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "grid gap-8",
        currentStep === "preview" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        {/* Form Section */}
        <div className={currentStep === "preview" ? "" : "lg:col-span-2"}>
          <FormSection
            step={currentStep}
            resume={resume}
            onSave={handleSave}
            onNext={goToNextStep}
            onPrev={goToPrevStep}
            isFirst={currentStepIndex === 0}
            isLast={currentStepIndex === FORM_STEPS.length - 1}
            isSaving={updateResume.isPending}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        </div>

        {/* Preview Section - only show on non-preview steps */}
        {currentStep !== "preview" && (
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live Preview
              </h3>
              <MiniResumePreview resume={resume} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

interface FormSectionProps {
  step: FormStep
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

function FormSection({
  step,
  resume,
  onSave,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isSaving,
  setHasUnsavedChanges,
}: FormSectionProps) {
  const commonProps = {
    resume,
    onSave,
    onNext,
    onPrev,
    isFirst,
    isLast,
    isSaving,
    setHasUnsavedChanges,
  }

  switch (step) {
    case "personal-info":
      return <PersonalInfoForm {...commonProps} />
    case "summary":
      return <SummaryForm {...commonProps} />
    case "experience":
      return <ExperienceForm {...commonProps} />
    case "education":
      return <EducationForm {...commonProps} />
    case "skills":
      return <SkillsForm {...commonProps} />
    case "projects":
      return <ProjectsForm {...commonProps} />
    case "certifications":
      return <CertificationsForm {...commonProps} />
    case "preview":
      return <ResumePreview resume={resume} onPrev={onPrev} isSaving={isSaving} />
    default:
      return null
  }
}
