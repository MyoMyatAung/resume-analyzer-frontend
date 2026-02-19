import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react"
import type { GeneratedResume, UpdateResumeDto } from "@/types/resume-builder"

interface PersonalInfoFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

export function PersonalInfoForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isFirst,
  isSaving,
  setHasUnsavedChanges,
}: PersonalInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: resume.fullName || "",
    targetTitle: resume.targetTitle || "",
    email: resume.email || "",
    phone: resume.phone || "",
    location: resume.location || "",
    linkedin: resume.linkedin || "",
    github: resume.github || "",
    website: resume.website || "",
  })

  useEffect(() => {
    setFormData({
      fullName: resume.fullName || "",
      targetTitle: resume.targetTitle || "",
      email: resume.email || "",
      phone: resume.phone || "",
      location: resume.location || "",
      linkedin: resume.linkedin || "",
      github: resume.github || "",
      website: resume.website || "",
    })
  }, [resume])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Enter your contact details. This information will appear at the top of your resume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetTitle">Target Title</Label>
            <Input
              id="targetTitle"
              placeholder="Software Engineer"
              value={formData.targetTitle}
              onChange={(e) => handleChange("targetTitle", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={formData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub Profile</Label>
            <Input
              id="github"
              placeholder="github.com/johndoe"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Personal Website</Label>
            <Input
              id="website"
              placeholder="johndoe.com"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onPrev} disabled={isFirst}>
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
