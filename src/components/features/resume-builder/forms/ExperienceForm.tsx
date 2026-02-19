import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, Save, Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import type { GeneratedResume, UpdateResumeDto, ExperienceItem } from "@/types/resume-builder"
import { v4 as uuidv4 } from "uuid"

interface ExperienceFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

const emptyExperience: ExperienceItem = {
  id: "",
  position: "",  // Changed from jobTitle
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,  // Changed from current
  description: "",  // Added for general description
  achievements: [""],  // Changed from responsibilities
  technologies: [],
}

export function ExperienceForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(
    resume.experiences.length > 0 ? resume.experiences : []
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<ExperienceItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setExperiences(resume.experiences.length > 0 ? resume.experiences : [])
  }, [resume])

  const handleAddExperience = () => {
    setCurrentExperience({ ...emptyExperience, id: uuidv4() })
    setIsEditing(false)
    setEditDialogOpen(true)
  }

  const handleEditExperience = (exp: ExperienceItem) => {
    setCurrentExperience({ ...exp })
    setIsEditing(true)
    setEditDialogOpen(true)
  }

  const handleDeleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleSaveExperience = () => {
    if (!currentExperience) return

    if (isEditing) {
      setExperiences((prev) =>
        prev.map((e) => (e.id === currentExperience.id ? currentExperience : e))
      )
    } else {
      setExperiences((prev) => [...prev, currentExperience])
    }

    setEditDialogOpen(false)
    setCurrentExperience(null)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave({ experiences })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  const updateCurrentExperience = (field: string, value: any) => {
    if (!currentExperience) return
    setCurrentExperience({ ...currentExperience, [field]: value })
  }

  const updateResponsibility = (index: number, value: string) => {
    if (!currentExperience) return
    const newAchievements = [...currentExperience.achievements]
    newAchievements[index] = value
    setCurrentExperience({ ...currentExperience, achievements: newAchievements })
  }

  const addResponsibility = () => {
    if (!currentExperience) return
    setCurrentExperience({
      ...currentExperience,
      achievements: [...currentExperience.achievements, ""],
    })
  }

  const removeResponsibility = (index: number) => {
    if (!currentExperience) return
    const newAchievements = currentExperience.achievements.filter((_, i) => i !== index)
    setCurrentExperience({ ...currentExperience, achievements: newAchievements })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>
                Add your professional experience, starting with your most recent position.
              </CardDescription>
            </div>
            <Button onClick={handleAddExperience}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiences.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No experience added yet.</p>
              <p className="text-sm">Click "Add Experience" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{exp.position}</div>
                    <div className="text-sm text-muted-foreground">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExperience(exp)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExperience(exp.id || "")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              Enter the details of your work experience.
            </DialogDescription>
          </DialogHeader>

          {currentExperience && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Job Title *</Label>
                  <Input
                    id="position"
                    placeholder="Software Engineer"
                    value={currentExperience.position}
                    onChange={(e) => updateCurrentExperience("position", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    value={currentExperience.company}
                    onChange={(e) => updateCurrentExperience("company", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={currentExperience.location}
                  onChange={(e) => updateCurrentExperience("location", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={currentExperience.startDate}
                    onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={currentExperience.endDate}
                    onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                    disabled={currentExperience.isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCurrent"
                  checked={currentExperience.isCurrent}
                  onCheckedChange={(checked) =>
                    updateCurrentExperience("isCurrent", checked)
                  }
                />
                <Label htmlFor="isCurrent">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Responsibilities & Achievements</Label>
                  <Button variant="ghost" size="sm" onClick={addResponsibility}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {currentExperience.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        placeholder="Describe a key responsibility or achievement..."
                        value={achievement}
                        onChange={(e) => updateResponsibility(index, e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      {currentExperience.achievements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeResponsibility(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExperience}>
              {isEditing ? "Update" : "Add"} Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
