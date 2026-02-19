import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnalysisDetail } from "@/hooks/useAnalysis"
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Briefcase,
} from "lucide-react"

interface AnalysisDetailProps {
  analysisId: string
}

export function AnalysisDetail({ analysisId }: AnalysisDetailProps) {
  const { data: analysis, isLoading, error } = useAnalysisDetail(analysisId)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/analysis">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Analysis
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-lg font-medium">Analysis not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              The analysis you're looking for doesn't exist or has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isMatchAnalysis = !!analysis.jobId

  const renderStatusBadge = () => {
    switch (analysis.status) {
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "PROCESSING":
        return <Badge variant="secondary">Processing</Badge>
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  const renderMatchResults = () => {
    const result = {
      overallMatchScore: analysis.matchScore ?? 0,
      jobTitle: analysis.job?.title || "Unknown Job",
      company: analysis.job?.company || "Unknown Company",
      matchedKeywords: analysis.matchedSkills || [],
      missingKeywords: analysis.missingSkills || [],
      summary: analysis.summary || "No summary available.",
      scores: analysis.qualityScores || { overall: 0, ats: 0, skill: 0, keyword: 0 },
      suggestions: analysis.suggestions || { strengths: [], improvements: [], quickTips: [] },
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
    const result = {
      summary: analysis.summary || "No summary available.",
      scores: analysis.qualityScores || { overall: 0, ats: 0, clarity: 0, keyword: 0, skill: 0 },
      suggestions: analysis.suggestions || { strengths: [], improvements: [], quickTips: [] },
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

  const renderProcessing = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Analysis in progress...</p>
        <p className="text-sm text-muted-foreground mt-1">
          Our AI is analyzing your resume. This usually takes 10-20 seconds.
        </p>
      </CardContent>
    </Card>
  )

  const renderFailed = () => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-medium">Analysis Failed</p>
        <p className="text-sm text-muted-foreground mt-1">
          {analysis.error || "An error occurred during the analysis. Please try again."}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/analysis">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Analysis
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {isMatchAnalysis ? "Match Analysis" : "Quality Analysis"}
              </h1>
              {renderStatusBadge()}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{analysis.resume?.fileName || analysis.generatedResume?.title || "Unknown Resume"}</span>
              </div>
              {isMatchAnalysis && analysis.job && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{analysis.job.title} at {analysis.job.company}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(analysis.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isMatchAnalysis ? (
              <Target className="h-6 w-6 text-primary" />
            ) : (
              <TrendingUp className="h-6 w-6 text-primary" />
            )}
          </div>
        </div>
      </div>

      {analysis.status === "PROCESSING" && renderProcessing()}
      {analysis.status === "FAILED" && renderFailed()}
      {analysis.status === "COMPLETED" && isMatchAnalysis && renderMatchResults()}
      {analysis.status === "COMPLETED" && !isMatchAnalysis && renderQualityResults()}
    </div>
  )
}
