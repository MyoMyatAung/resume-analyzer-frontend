import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin } from "lucide-react"
import type { GeneratedResume } from "@/types/resume-builder"

interface MiniResumePreviewProps {
  resume: GeneratedResume
}

export function MiniResumePreview({ resume }: MiniResumePreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-4 text-xs">
          {/* Header */}
          <div className="border-b pb-3">
            <h3 className="font-bold text-sm truncate">{resume.fullName || "Your Name"}</h3>
            <div className="flex flex-wrap gap-2 mt-1 text-muted-foreground">
              {resume.email && (
                <span className="flex items-center gap-1 truncate max-w-full">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{resume.email}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-1 text-muted-foreground">
              {resume.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {resume.phone}
                </span>
              )}
              {resume.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {resume.location}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {resume.summary && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Summary</h4>
              <p className="text-muted-foreground line-clamp-3">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          {resume.experiences.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Experience</h4>
              <div className="space-y-2">
                {resume.experiences.slice(0, 2).map((exp, index) => (
                  <div key={exp.id || index}>
                    <div className="font-medium truncate">{exp.position}</div>
                    <div className="text-muted-foreground truncate">{exp.company}</div>
                  </div>
                ))}
                {resume.experiences.length > 2 && (
                  <p className="text-muted-foreground">
                    +{resume.experiences.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Education</h4>
              <div className="space-y-1">
                {resume.education.slice(0, 1).map((edu, index) => (
                  <div key={edu.id || index}>
                    <div className="font-medium truncate">{edu.degree}</div>
                    <div className="text-muted-foreground truncate">{edu.institution}</div>
                  </div>
                ))}
                {resume.education.length > 1 && (
                  <p className="text-muted-foreground">
                    +{resume.education.length - 1} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {(resume.skills.technical.length > 0 || resume.skills.soft.length > 0) && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {[...resume.skills.technical.slice(0, 4), ...resume.skills.soft.slice(0, 2)].map(
                  (skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px] py-0 px-1">
                      {skill}
                    </Badge>
                  )
                )}
                {resume.skills.technical.length + resume.skills.soft.length > 6 && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1">
                    +{resume.skills.technical.length + resume.skills.soft.length - 6}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Projects</h4>
              <p className="text-muted-foreground">
                {resume.projects.length} project{resume.projects.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs mb-1">Certifications</h4>
              <p className="text-muted-foreground">
                {resume.certifications.length} certification{resume.certifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!resume.summary &&
            resume.experiences.length === 0 &&
            resume.education.length === 0 &&
            resume.skills.technical.length === 0 &&
            resume.skills.soft.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p>Start filling out your resume</p>
                <p className="text-[10px]">Your changes will appear here</p>
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
