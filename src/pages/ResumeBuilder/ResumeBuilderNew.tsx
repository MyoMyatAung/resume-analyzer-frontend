import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useCreateResume, useResumeTemplates } from "@/hooks/useResumeBuilder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check, Loader2, FileText } from "lucide-react"
import { ROUTES } from "@/lib/constants"
import type { CreateResumeDto, ResumeTemplate } from "@/types/resume-builder"
import { cn } from "@/lib/utils"

type Step = "template" | "basics"

export function ResumeBuilderNew() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>("template")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    targetTitle: "",
    email: "",
  })

  const { data: templates, isLoading: templatesLoading } = useResumeTemplates()
  const createResume = useCreateResume()

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template")
      return
    }

    if (!formData.title.trim() || !formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const data: CreateResumeDto = {
        title: formData.title.trim(),
        templateId: selectedTemplate,
        fullName: formData.fullName.trim(),
        targetTitle: formData.targetTitle.trim(),
        email: formData.email.trim(),
      }

      const resume = await createResume.mutateAsync(data)
      toast.success("Resume created successfully!")
      navigate({ to: ROUTES.RESUME_BUILDER_EDIT(resume.id) })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || "Failed to create resume")
    }
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: ROUTES.RESUME_BUILDER })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resumes
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Resume</h1>
        <p className="text-muted-foreground mt-2">
          {step === "template"
            ? "Choose a template to get started"
            : "Enter your basic information"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <StepIndicator
            number={1}
            label="Template"
            isActive={step === "template"}
            isComplete={step === "basics"}
          />
          <div className="w-16 h-0.5 bg-muted" />
          <StepIndicator
            number={2}
            label="Basics"
            isActive={step === "basics"}
            isComplete={false}
          />
        </div>
      </div>

      {step === "template" && (
        <TemplateSelector
          templates={templates || []}
          isLoading={templatesLoading}
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
          onNext={() => setStep("basics")}
        />
      )}

      {step === "basics" && (
        <BasicsForm
          formData={formData}
          onChange={setFormData}
          onBack={() => setStep("template")}
          onSubmit={handleSubmit}
          isSubmitting={createResume.isPending}
        />
      )}
    </main>
  )
}

interface StepIndicatorProps {
  number: number
  label: string
  isActive: boolean
  isComplete: boolean
}

function StepIndicator({ number, label, isActive, isComplete }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
          isComplete && "bg-primary text-primary-foreground",
          isActive && !isComplete && "bg-primary text-primary-foreground",
          !isActive && !isComplete && "bg-muted text-muted-foreground"
        )}
      >
        {isComplete ? <Check className="h-4 w-4" /> : number}
      </div>
      <span
        className={cn(
          "text-sm font-medium",
          isActive || isComplete ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}

interface TemplateSelectorProps {
  templates: ResumeTemplate[]
  isLoading: boolean
  selectedTemplate: string | null
  onSelect: (templateKey: string) => void
  onNext: () => void
}

function TemplateSelector({
  templates,
  isLoading,
  selectedTemplate,
  onSelect,
  onNext,
}: TemplateSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedTemplate === template.templateKey &&
              "ring-2 ring-primary shadow-md"
            )}
            onClick={() => onSelect(template.templateKey)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                {selectedTemplate === template.templateKey && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-[8.5/11] bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm overflow-hidden">
                {template.previewUrl ? (
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-full object-contain rounded-md"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 opacity-50" />
                    <span>Preview</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedTemplate}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface BasicsFormProps {
  formData: {
    title: string
    fullName: string
    targetTitle: string
    email: string
  }
  onChange: (data: { title: string; fullName: string; targetTitle: string; email: string }) => void
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

function BasicsForm({
  formData,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}: BasicsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter a title for your resume and your basic contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Resume Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Software Engineer Resume"
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            This is for your reference only and won't appear on the resume.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => onChange({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetTitle">Target Title</Label>
            <Input
              id="targetTitle"
              placeholder="e.g., Software Engineer"
              value={formData.targetTitle}
              onChange={(e) => onChange({ ...formData, targetTitle: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
