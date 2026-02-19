import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  X,
  ExternalLink,
} from "lucide-react"
import type { GeneratedResume, UpdateResumeDto, ProjectItem } from "@/types/resume-builder"
import { v4 as uuidv4 } from "uuid"

interface ProjectsFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

const emptyProject: ProjectItem = {
  id: "",
  name: "",
  description: "",
  technologies: [],
  link: "",
  highlights: [],
}

export function ProjectsForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: ProjectsFormProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(
    resume.projects.length > 0 ? resume.projects : []
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newTech, setNewTech] = useState("")
  const [newHighlight, setNewHighlight] = useState("")

  useEffect(() => {
    setProjects(resume.projects.length > 0 ? resume.projects : [])
  }, [resume])

  const handleAdd = () => {
    setCurrentProject({ ...emptyProject, id: uuidv4() })
    setIsEditing(false)
    setNewTech("")
    setNewHighlight("")
    setEditDialogOpen(true)
  }

  const handleEdit = (project: ProjectItem) => {
    setCurrentProject({ ...project })
    setIsEditing(true)
    setNewTech("")
    setNewHighlight("")
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleSaveItem = () => {
    if (!currentProject) return

    if (isEditing) {
      setProjects((prev) =>
        prev.map((p) => (p.id === currentProject.id ? currentProject : p))
      )
    } else {
      setProjects((prev) => [...prev, currentProject])
    }

    setEditDialogOpen(false)
    setCurrentProject(null)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave({ projects })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  const updateField = (field: string, value: string) => {
    if (!currentProject) return
    setCurrentProject({ ...currentProject, [field]: value })
  }

  const addTechnology = () => {
    if (!currentProject || !newTech.trim()) return
    if (currentProject.technologies.includes(newTech.trim())) return

    setCurrentProject({
      ...currentProject,
      technologies: [...currentProject.technologies, newTech.trim()],
    })
    setNewTech("")
  }

  const removeTechnology = (tech: string) => {
    if (!currentProject) return
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter((t) => t !== tech),
    })
  }

  const addHighlight = () => {
    if (!currentProject || !newHighlight.trim()) return

    setCurrentProject({
      ...currentProject,
      highlights: [...(currentProject.highlights || []), newHighlight.trim()],
    })
    setNewHighlight("")
  }

  const removeHighlight = (index: number) => {
    if (!currentProject) return
    setCurrentProject({
      ...currentProject,
      highlights: (currentProject.highlights || []).filter((_, i) => i !== index),
    })
  }

  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechnology()
    }
  }

  const handleHighlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addHighlight()
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Showcase your personal or professional projects that demonstrate your skills.
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No projects added yet.</p>
              <p className="text-sm">Click "Add Project" to showcase your work.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{project.name}</div>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </div>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id || "")}>
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
            <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
            <DialogDescription>
              Enter the details of your project.
            </DialogDescription>
          </DialogHeader>

          {currentProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., E-commerce Platform"
                  value={currentProject.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its purpose, and your role..."
                  value={currentProject.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Project Link (Optional)</Label>
                <Input
                  id="link"
                  placeholder="https://github.com/username/project"
                  value={currentProject.link}
                  onChange={(e) => updateField("link", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., React, Node.js, PostgreSQL"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTechnology}
                    disabled={!newTech.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="py-1 px-2">
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Key Highlights (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Increased performance by 40%"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={handleHighlightKeyDown}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addHighlight}
                    disabled={!newHighlight.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {(currentProject.highlights || []).length > 0 && (
                  <ul className="space-y-1 mt-2">
                    {(currentProject.highlights || []).map((highlight, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded"
                      >
                        <span className="flex-1">• {highlight}</span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={!currentProject?.name || !currentProject?.description}
            >
              {isEditing ? "Update" : "Add"} Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
