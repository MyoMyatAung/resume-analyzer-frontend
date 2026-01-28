import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useResumes } from "@/hooks/useResumes"
import { useJobs } from "@/hooks/useJobs"
import { useMatchAnalysis, useQualityAnalysis, useAnalysisStatus } from "@/hooks/useAnalysis"
import { useAnalysisSocket } from "@/hooks/useAnalysisSocket"
import { Target, TrendingUp, Loader2, CheckCircle, XCircle } from "lucide-react"
import type { Resume } from "@/types/resume"
import type { Job } from "@/types/job"

export function Analysis() {
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: jobs, isLoading: jobsLoading } = useJobs()
  const matchAnalysis = useMatchAnalysis()
  const qualityAnalysis = useQualityAnalysis()

  // Real-time updates
  useAnalysisSocket()

  const [selectedResumeId, setSelectedResumeId] = useState<string>("")
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [analysisType, setAnalysisType] = useState<"match" | "quality">("quality")
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null)

  const { data: asyncResult, isLoading: resultLoading } = useAnalysisStatus(currentAnalysisId)

  const handleMatchAnalysis = async () => {
    if (!selectedResumeId || !selectedJobId) return
    try {
      const response = await matchAnalysis.mutateAsync({
        resumeId: selectedResumeId,
        jobId: selectedJobId,
      })
      if (response.analysisId) {
        setCurrentAnalysisId(response.analysisId)
      }
    } catch (error) {
      console.error("Match analysis error:", error)
    }
  }

  const handleQualityAnalysis = async () => {
    if (!selectedResumeId) return
    try {
      const response = await qualityAnalysis.mutateAsync({
        resumeId: selectedResumeId,
      })
      if (response.analysisId) {
        setCurrentAnalysisId(response.analysisId)
      }
    } catch (error) {
      console.error("Quality analysis error:", error)
    }
  }

  const isProcessing = asyncResult?.status === "PROCESSING" || resultLoading
  const isLoading = resumesLoading || jobsLoading || matchAnalysis.isPending || qualityAnalysis.isPending || isProcessing

  const renderMatchResults = () => {
    if (!asyncResult || asyncResult.status !== "COMPLETED") return null

    const result = {
      overallMatchScore: asyncResult.matchScore ?? 0,
      jobTitle: asyncResult.job?.title || "Unknown Job",
      company: asyncResult.job?.company || "Unknown Company",
      matchedKeywords: asyncResult.matchedSkills || [],
      missingKeywords: asyncResult.missingSkills || [],
      summary: asyncResult.summary || "No summary available.",
      scores: (asyncResult.qualityScores as any) || { overall: 0, ats: 0, skill: 0, keyword: 0 },
      suggestions: (asyncResult.suggestions as any) || { strengths: [], improvements: [], quickTips: [] },
    }

    return (
      <div className="space-y-8">
        {/* Hero Score Section */}
        <div className="flex items-center gap-6 bg-primary/5 p-6 rounded-xl border border-primary/10">
          <div className="text-7xl font-bold text-primary">{result.overallMatchScore}%</div>
          <div>
            <p className="text-xl font-semibold">Overall Match Score</p>
            <p className="text-muted-foreground">
              {result.jobTitle} at {result.company}
            </p>
          </div>
        </div>

        {/* Secondary Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Keywords Gap Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.keyword}%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ATS Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.ats}%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Skill Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.skill}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Keywords Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Matched Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.matchedKeywords?.length > 0 ? (
                  result.matchedKeywords.map((tag: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 font-bold">•</span>
                      <span>{tag}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No matched keywords identified.</p>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Missing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.missingKeywords?.length > 0 ? (
                  result.missingKeywords.map((tag: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{tag}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No missing keywords identified.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Rich Feedback Lists */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Strength
            </h3>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Make these changes
            </h3>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.improvements?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-600" />
              Quick tips
            </h3>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.quickTips?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderQualityResults = () => {
    if (!asyncResult || asyncResult.status !== "COMPLETED") return null

    const result = {
      summary: asyncResult.summary || "No summary available.",
      scores: (asyncResult.qualityScores as any) || { overall: 0, ats: 0, clarity: 0, keyword: 0, skill: 0 },
      suggestions: (asyncResult.suggestions as any) || { strengths: [], improvements: [], quickTips: [] },
    }

    return (
      <div className="space-y-8">
        {/* Hero Score Section */}
        <div className="flex items-center gap-6 bg-primary/5 p-6 rounded-xl border border-primary/10">
          <div className="text-7xl font-bold text-primary">{result.scores.overall}%</div>
          <div>
            <p className="text-xl font-semibold">Overall Quality Score</p>
            <p className="text-muted-foreground">Based on general professional standards and ATS criteria</p>
          </div>
        </div>

        {/* Secondary Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ATS Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.ats}%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.clarity}%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Keywords opt.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.keyword}%</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Skill Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{result.scores.skill}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Rich Feedback Lists */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Strength
            </h3>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.strengths?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Make these changes
            </h3>
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.improvements?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-orange-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-blue-600" />
              Quick tips
            </h3>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {result.suggestions.quickTips?.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-sm leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
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
          {asyncResult?.status === "COMPLETED" && analysisType === "match" && (
            <Card>
              <CardHeader>
                <CardTitle>Match Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>{renderMatchResults()}</CardContent>
            </Card>
          )}

          {asyncResult?.status === "COMPLETED" && analysisType === "quality" && (
            <Card>
              <CardHeader>
                <CardTitle>Quality Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>{renderQualityResults()}</CardContent>
            </Card>
          )}

          {asyncResult?.status === "PROCESSING" && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-lg font-medium">Analysis in progress...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Our AI is analyzing your resume. This usually takes 10-20 seconds.
                </p>
              </CardContent>
            </Card>
          )}

          {(!asyncResult || (asyncResult.status !== "COMPLETED" && asyncResult.status !== "PROCESSING")) && (
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
