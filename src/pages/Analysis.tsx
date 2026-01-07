import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useResumes } from "@/hooks/useResumes"
import { useJobs } from "@/hooks/useJobs"
import { useMatchAnalysis, useQualityAnalysis } from "@/hooks/useAnalysis"
import { Target, TrendingUp, Loader2, CheckCircle, XCircle } from "lucide-react"
import type { Resume } from "@/types/resume"
import type { Job } from "@/types/job"

export function Analysis() {
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: jobs, isLoading: jobsLoading } = useJobs()
  const matchAnalysis = useMatchAnalysis()
  const qualityAnalysis = useQualityAnalysis()

  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [analysisType, setAnalysisType] = useState<"match" | "quality">("quality")

  const handleMatchAnalysis = async () => {
    if (!selectedResumeId || !selectedJobId) return
    await matchAnalysis.mutateAsync({
      resumeId: selectedResumeId,
      jobId: selectedJobId,
    })
  }

  const handleQualityAnalysis = async () => {
    if (!selectedResumeId) return
    await qualityAnalysis.mutateAsync({
      resumeId: selectedResumeId,
    })
  }

  const isLoading = resumesLoading || jobsLoading || matchAnalysis.isPending || qualityAnalysis.isPending

  const renderMatchResults = () => {
    const result = matchAnalysis.data
    if (!result) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="text-6xl font-bold text-primary">{result.matchScore}%</div>
          <div>
            <p className="text-lg font-medium">Match Score</p>
            <p className="text-muted-foreground">
              {result.jobTitle} at {result.company}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Matched Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill: string) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill: string) => (
                  <Badge key={skill} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Experience Match</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.experienceMatch}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.recommendations}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.summary}</p>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Resume Quality Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Skill Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.quality.skillCoverage}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Experience Relevance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.quality.experienceRelevance}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ATS Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.quality.atsCompatibility}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clarity & Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{result.quality.clarityStructure}%</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gaps Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Areas for Improvement</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.missingSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="destructive">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-orange-500" />
                  Underrepresented Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.gaps.underrepresentedExperience.map((experience: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {experience}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-yellow-500" />
                  Weak Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.gaps.weakKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">{keyword}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Suggestions Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Resume Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.suggestions.resumeImprovement.map((suggestion: string, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium text-blue-600 mb-1">Tip {index + 1}:</div>
                      <div className="text-muted-foreground">{suggestion}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Skill Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.suggestions.skillRecommendations.map((skill: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  Keyword Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.suggestions.keywordEnhancement.map((keyword: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {keyword}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderQualityResults = () => {
    const result = qualityAnalysis.data
    if (!result) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="text-6xl font-bold text-primary">{result.quality.overallScore}</div>
          <div>
            <p className="text-lg font-medium">Overall Quality Score</p>
            <p className="text-muted-foreground">Based on skill coverage, experience, ATS, and clarity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Skill Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.quality.skillCoverage}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Experience Relevance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.quality.experienceRelevance}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">ATS Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.quality.atsCompatibility}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clarity & Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.quality.clarityStructure}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Gaps Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.gaps.missingSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="destructive">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-orange-500" />
                Underrepresented Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.gaps.underrepresentedExperience.map((experience: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {experience}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-yellow-500" />
                Weak Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.gaps.weakKeywords.map((keyword: string, index: number) => (
                  <Badge key={index} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Resume Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.suggestions.resumeImprovement.map((suggestion: string, index: number) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-blue-600 mb-1">Tip {index + 1}:</div>
                    <div className="text-muted-foreground">{suggestion}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Skill Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.suggestions.skillRecommendations.map((skill: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {skill}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Keyword Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.suggestions.keywordEnhancement.map((keyword: string, index: number) => (
                  <Badge key={index} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Analyze your resumes against job descriptions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Run Analysis</CardTitle>
              <CardDescription>
                Select a resume and analysis type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Resume</label>
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes?.map((resume: Resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Analysis Type</label>
                <Select
                  value={analysisType}
                  onValueChange={(value) => setAnalysisType(value as "match" | "quality")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Job Match Analysis
                      </div>
                    </SelectItem>
                    <SelectItem value="quality">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Quality Analysis
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {analysisType === "match" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Description</label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs?.map((job: Job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} at {job.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="w-full"
                disabled={isLoading || !selectedResumeId || (analysisType === "match" && !selectedJobId)}
                onClick={analysisType === "match" ? handleMatchAnalysis : handleQualityAnalysis}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Analyzing..." : "Run Analysis"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {matchAnalysis.isSuccess && analysisType === "match" && (
            <Card>
              <CardHeader>
                <CardTitle>Match Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>{renderMatchResults()}</CardContent>
            </Card>
          )}

          {qualityAnalysis.isSuccess && analysisType === "quality" && (
            <Card>
              <CardHeader>
                <CardTitle>Quality Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>{renderQualityResults()}</CardContent>
            </Card>
          )}

          {!matchAnalysis.isSuccess && !qualityAnalysis.isSuccess && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No analysis yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a resume and run an analysis to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
