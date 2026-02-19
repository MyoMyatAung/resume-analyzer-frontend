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
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ExternalLink,
  Award,
} from "lucide-react"
import type { GeneratedResume, UpdateResumeDto, CertificationItem } from "@/types/resume-builder"
import { v4 as uuidv4 } from "uuid"

interface CertificationsFormProps {
  resume: GeneratedResume
  onSave: (data: UpdateResumeDto) => Promise<void>
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
  isSaving: boolean
  setHasUnsavedChanges: (value: boolean) => void
}

const emptyCertification: CertificationItem = {
  id: "",
  name: "",
  issuer: "",
  issueDate: "",  // Changed from 'date'
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",  // Changed from 'url'
}

export function CertificationsForm({
  resume,
  onSave,
  onNext,
  onPrev,
  isSaving,
  setHasUnsavedChanges,
}: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    resume.certifications.length > 0 ? resume.certifications : []
  )
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentCertification, setCurrentCertification] = useState<CertificationItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setCertifications(resume.certifications.length > 0 ? resume.certifications : [])
  }, [resume])

  const handleAdd = () => {
    setCurrentCertification({ ...emptyCertification, id: uuidv4() })
    setIsEditing(false)
    setEditDialogOpen(true)
  }

  const handleEdit = (cert: CertificationItem) => {
    setCurrentCertification({ ...cert })
    setIsEditing(true)
    setEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id))
    setHasUnsavedChanges(true)
  }

  const handleSaveItem = () => {
    if (!currentCertification) return

    if (isEditing) {
      setCertifications((prev) =>
        prev.map((c) => (c.id === currentCertification.id ? currentCertification : c))
      )
    } else {
      setCertifications((prev) => [...prev, currentCertification])
    }

    setEditDialogOpen(false)
    setCurrentCertification(null)
    setHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    await onSave({ certifications })
  }

  const handleSaveAndNext = async () => {
    await handleSave()
    onNext()
  }

  const updateField = (field: string, value: string) => {
    if (!currentCertification) return
    setCurrentCertification({ ...currentCertification, [field]: value })
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Add your professional certifications and licenses to demonstrate your expertise.
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No certifications added yet.</p>
              <p className="text-sm">Click "Add Certification" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  <div className="text-muted-foreground cursor-move">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{cert.name}</div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span>Issued: {formatDate(cert.issueDate)}</span>
                      {cert.expiryDate && (
                        <>
                          <span>•</span>
                          <span className={isExpired(cert.expiryDate) ? "text-destructive" : ""}>
                            {isExpired(cert.expiryDate) ? "Expired" : "Expires"}: {formatDate(cert.expiryDate)}
                          </span>
                        </>
                      )}
                    </div>
                    {cert.credentialId && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Credential ID: {cert.credentialId}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cert)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id || "")}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
            <DialogDescription>
              Enter the details of your certification or license.
            </DialogDescription>
          </DialogHeader>

          {currentCertification && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AWS Solutions Architect Professional"
                  value={currentCertification.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization *</Label>
                <Input
                  id="issuer"
                  placeholder="e.g., Amazon Web Services"
                  value={currentCertification.issuer}
                  onChange={(e) => updateField("issuer", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="month"
                    value={currentCertification.issueDate}
                    onChange={(e) => updateField("issueDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="month"
                    value={currentCertification.expiryDate}
                    onChange={(e) => updateField("expiryDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID (Optional)</Label>
                <Input
                  id="credentialId"
                  placeholder="e.g., ABC123XYZ"
                  value={currentCertification.credentialId}
                  onChange={(e) => updateField("credentialId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
                <Input
                  id="credentialUrl"
                  placeholder="https://www.credly.com/badges/..."
                  value={currentCertification.credentialUrl}
                  onChange={(e) => updateField("credentialUrl", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveItem}
              disabled={!currentCertification?.name || !currentCertification?.issuer || !currentCertification?.issueDate}
            >
              {isEditing ? "Update" : "Add"} Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
