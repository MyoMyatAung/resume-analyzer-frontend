import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, ArrowRight, Save, Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react"
import type { GeneratedResume, UpdateResumeDto, EducationItem } from "@/types/resume-builder"
import { v4 as uuidv4 } from "uuid"

interface EducationFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

const emptyEducation: EducationItem = {
  id: "",
  degree: "",
  field: "",  // Field of study (required)
  institution: "",
  location: "",
  startDate: "",  // Start date (required)
  endDate: "",  // Changed from graduationDate
  gpa: "",
  honors: "",
  achievements: [],
}

export function EducationForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: EducationFormProps) {
  const [education, setEducation] = useState<EducationItem[]>(
    resume.education.length > 0 ? resume.education : []
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<EducationItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setEducation(resume.education.length > 0 ? resume.education : [])
  }, [resume])

  const handleAdd = () => {
    setCurrentEducation({ ...emptyEducation, id: uuidv4() })
    setIsEditing(false)
    setEditDialogOpen(true)
  }

  const handleEdit = (edu: EducationItem) => {
    setCurrentEducation({ ...edu })
    setIsEditing(true)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleSaveItem = () => {
    if (!currentEducation) return

    if (isEditing) {
      setEducation((prev) =>
        prev.map((e) => (e.id === currentEducation.id ? currentEducation : e))
      )
    } else {
      setEducation((prev) => [...prev, currentEducation])
    }

    setEditDialogOpen(false)
    setCurrentEducation(null)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave({ education })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  const updateField = (field: string, value: string) => {
    if (!currentEducation) return
    setCurrentEducation({ ...currentEducation, [field]: value })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>
                Add your educational background, including degrees, certifications, and relevant coursework.
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No education added yet.</p>
              <p className="text-sm">Click "Add Education" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div
                  key={edu.id || index}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {edu.startDate} - {edu.endDate || "Present"}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(edu.id || "")}>
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
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Education" : "Add Education"}</DialogTitle>
            <DialogDescription>Enter your educational details.</DialogDescription>
          </DialogHeader>

          {currentEducation && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree / Certificate *</Label>
                <Input
                  id="degree"
                  placeholder="Bachelor of Science"
                  value={currentEducation.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Field of Study *</Label>
                <Input
                  id="field"
                  placeholder="Computer Science"
                  value={currentEducation.field}
                  onChange={(e) => updateField("field", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  placeholder="Stanford University"
                  value={currentEducation.institution}
                  onChange={(e) => updateField("institution", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Stanford, CA"
                    value={currentEducation.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={currentEducation.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={currentEducation.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    placeholder="3.8/4.0"
                    value={currentEducation.gpa}
                    onChange={(e) => updateField("gpa", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="honors">Honors</Label>
                <Input
                  id="honors"
                  placeholder="Magna Cum Laude"
                  value={currentEducation.honors}
                  onChange={(e) => updateField("honors", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>{isEditing ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
