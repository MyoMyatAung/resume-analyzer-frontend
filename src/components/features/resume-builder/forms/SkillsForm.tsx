import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Plus,
  X,
  Sparkles,
  Check,
} from "lucide-react"
import type {
  GeneratedResume,
  UpdateResumeDto,
  SkillsData,
  SuggestSkillsResult,
} from "@/types/resume-builder"
import { useSuggestSkills } from "@/hooks/useAIAssistant"
import { useResumeBuilderSocket } from "@/components/providers/ResumeBuilderSocketProvider"

interface SkillsFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

const DEFAULT_SKILLS: SkillsData = {
  technical: [],
  soft: [],
  languages: [],
  certifications: [],
}

export function SkillsForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: SkillsFormProps) {
  const [skills, setSkills] = useState<SkillsData>(
    resume.skills || DEFAULT_SKILLS
  )
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
  })

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<SuggestSkillsResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [experienceLevel, setExperienceLevel] = useState<"junior" | "mid" | "senior" | "lead">("mid")
  const [targetRole, setTargetRole] = useState("")

  const { lastAIResult, clearAIResult } = useResumeBuilderSocket()
  const suggestSkillsMutation = useSuggestSkills(resume.id)

  // Listen for AI suggestions via WebSocket
  useEffect(() => {
    if (lastAIResult && lastAIResult.contentType === "suggest-skills") {
      setAiSuggestions(lastAIResult.result as SuggestSkillsResult)
      setIsGenerating(false)
      clearAIResult()
    }
  }, [lastAIResult, clearAIResult])

  // Sync with resume data
  useEffect(() => {
    setSkills(resume.skills || DEFAULT_SKILLS)
  }, [resume])

  const handleRequestAISuggestions = async () => {
    setIsGenerating(true)
    setAiSuggestions(null)

    try {
      // Backend expects experiences array and existingSkillsJson string
      await suggestSkillsMutation.mutateAsync({
        experiences: resume.experiences,
        existingSkillsJson: JSON.stringify([...skills.technical, ...skills.soft]),
        context: {
          targetRole: targetRole || undefined,
        },
      })
      // Results will come via WebSocket
    } catch (error) {
      console.error("Failed to request AI suggestions:", error)
      setIsGenerating(false)
    }
  }

  const addSkill = (category: keyof typeof newSkill) => {
    const skill = newSkill[category].trim()
    if (!skill) return

    const skillKey = category as keyof SkillsData
    const currentSkills = skills[skillKey] || []
    if (currentSkills.includes(skill)) return

    setSkills((prev) => ({
      ...prev,
      [skillKey]: [...(prev[skillKey] || []), skill],
    }))
    setNewSkill((prev) => ({ ...prev, [category]: "" }))
    setHasUnsavedChanges(true)
  }

  const removeSkill = (category: keyof SkillsData, skill: string) => {
    setSkills((prev) => ({
      ...prev,
      [category]: (prev[category] || []).filter((s) => s !== skill),
    }))
    setHasUnsavedChanges(true)
  }

  const addSuggestedSkill = (skill: string, category: "technical" | "soft") => {
    const currentSkills = skills[category] || []
    if (currentSkills.includes(skill)) return

    setSkills((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), skill],
    }))
    setHasUnsavedChanges(true)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: keyof typeof newSkill
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(category)
    }
  }

  const handleSave = async () => {
    await onSave({ skills })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  const isSkillAlreadyAdded = (skill: string, category: "technical" | "soft") => {
    return (skills[category] || []).includes(skill)
  }

  return (
    <div className="space-y-6">
      {/* AI Suggestions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Skill Suggestions
              </CardTitle>
              <CardDescription>
                Get personalized skill suggestions based on your experience and target role.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={experienceLevel}
                onValueChange={(value: "junior" | "mid" | "senior" | "lead") =>
                  setExperienceLevel(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                  <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleRequestAISuggestions}
            disabled={isGenerating}
            variant="outline"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get AI Suggestions
              </>
            )}
          </Button>

          {aiSuggestions && (
            <div className="space-y-4 mt-4 p-4 bg-muted/50 rounded-lg">
              {aiSuggestions.technicalSkills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Suggested Technical Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.technicalSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={isSkillAlreadyAdded(skill, "technical") ? "secondary" : "outline"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => !isSkillAlreadyAdded(skill, "technical") && addSuggestedSkill(skill, "technical")}
                      >
                        {isSkillAlreadyAdded(skill, "technical") ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Plus className="mr-1 h-3 w-3" />
                        )}
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.softSkills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Suggested Soft Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.softSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={isSkillAlreadyAdded(skill, "soft") ? "secondary" : "outline"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => !isSkillAlreadyAdded(skill, "soft") && addSuggestedSkill(skill, "soft")}
                      >
                        {isSkillAlreadyAdded(skill, "soft") ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Plus className="mr-1 h-3 w-3" />
                        )}
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.emergingSkills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Emerging Skills to Consider</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.emergingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant={isSkillAlreadyAdded(skill, "technical") ? "secondary" : "outline"}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => !isSkillAlreadyAdded(skill, "technical") && addSuggestedSkill(skill, "technical")}
                      >
                        {isSkillAlreadyAdded(skill, "technical") ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <Plus className="mr-1 h-3 w-3" />
                        )}
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.certificationSuggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Recommended Certifications
                  </Label>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {aiSuggestions.certificationSuggestions.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Skills Form */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add your technical skills, soft skills, and languages. Press Enter or click Add to add each skill.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technical Skills */}
          <div className="space-y-3">
            <Label>Technical Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Python, AWS"
                value={newSkill.technical}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, technical: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, "technical")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill("technical")}
                disabled={!newSkill.technical.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(skills.technical || []).map((skill) => (
                <Badge key={skill} variant="secondary" className="py-1 px-2">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("technical", skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(skills.technical || []).length === 0 && (
                <span className="text-sm text-muted-foreground">No technical skills added yet</span>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-3">
            <Label>Soft Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Leadership, Communication, Problem Solving"
                value={newSkill.soft}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, soft: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, "soft")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill("soft")}
                disabled={!newSkill.soft.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(skills.soft || []).map((skill) => (
                <Badge key={skill} variant="secondary" className="py-1 px-2">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill("soft", skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(skills.soft || []).length === 0 && (
                <span className="text-sm text-muted-foreground">No soft skills added yet</span>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>Languages</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., English (Native), Spanish (Fluent)"
                value={newSkill.languages}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, languages: e.target.value }))}
                onKeyDown={(e) => handleKeyDown(e, "languages")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill("languages")}
                disabled={!newSkill.languages.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(skills.languages || []).map((lang) => (
                <Badge key={lang} variant="secondary" className="py-1 px-2">
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeSkill("languages", lang)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(skills.languages || []).length === 0 && (
                <span className="text-sm text-muted-foreground">No languages added yet</span>
              )}
            </div>
          </div>

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
    </div>
  )
}
