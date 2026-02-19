import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Save, Loader2, Sparkles } from "lucide-react"
import { useGenerateSummary } from "@/hooks/useAIAssistant"
import { useResumeBuilderSocket } from "@/components/providers/ResumeBuilderSocketProvider"
import { toast } from "sonner"
import type { GeneratedResume, UpdateResumeDto, GenerateSummaryResult } from "@/types/resume-builder"

interface SummaryFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

export function SummaryForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: SummaryFormProps) {
  const [summary, setSummary] = useState(resume.summary || "")
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const generateSummary = useGenerateSummary(resume.id)
  const { lastAIResult, clearAIResult } = useResumeBuilderSocket()

  useEffect(() => {
    setSummary(resume.summary || "")
  }, [resume])

  // Handle AI result from WebSocket
  useEffect(() => {
    if (lastAIResult && lastAIResult.contentType === "generate-summary") {
      const result = lastAIResult.result as GenerateSummaryResult
      setSummary(result.summary)
      setSuggestions(result.alternativeSummaries)
      setIsGenerating(false)
      setHasUnsavedChanges(true)
      clearAIResult()
    }
  }, [lastAIResult, clearAIResult, setHasUnsavedChanges])

  const handleChange = (value: string) => {
    setSummary(value)
    setHasUnsavedChanges(true)
  }

  const handleGenerateWithAI = async () => {
    // Backend expects experiences array
    if (resume.experiences.length === 0) {
      toast.error("Add experience first", {
        description: "AI needs some work experience context to generate a summary.",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Backend expects: { experiences, educationJson?, context? }
      await generateSummary.mutateAsync({
        experiences: resume.experiences,
        educationJson: resume.education.length > 0 ? JSON.stringify(resume.education) : undefined,
        context: {
          targetRole: resume.experiences[0]?.position || "Professional",
        },
      })
      toast.success("Generating summary...", {
        description: "This may take a few seconds.",
      })
    } catch {
      setIsGenerating(false)
      toast.error("Failed to generate summary")
    }
  }

  const handleUseSuggestion = (suggestion: string) => {
    setSummary(suggestion)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave({ summary })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Professional Summary</CardTitle>
            <CardDescription>
              Write a compelling summary that highlights your key qualifications and career objectives.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateWithAI}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            placeholder="Results-driven software engineer with 5+ years of experience..."
            value={summary}
            onChange={(e) => handleChange(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {summary.length}/500 characters recommended
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <Label>Alternative suggestions:</Label>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted rounded-md text-sm cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => handleUseSuggestion(suggestion)}
                >
                  {suggestion}
                  <span className="block text-xs text-muted-foreground mt-1">
                    Click to use this version
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
            <Button onClick={handleSaveAndNext} disabled={isSaving}>
              Save & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
