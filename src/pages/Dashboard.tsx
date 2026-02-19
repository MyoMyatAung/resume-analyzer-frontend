import { Link } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useResumes } from "@/hooks/useResumes"
import { useJobs } from "@/hooks/useJobs"
import { FileText, Target, TrendingUp, Upload, Sparkles, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalyses } from "@/hooks/useAnalysis"
import { useGeneratedResumes } from "@/hooks/useResumeBuilder"

export function Dashboard() {
  const { user } = useAuthStore()
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: generatedResumes, isLoading: generatedLoading } = useGeneratedResumes(1, 10)
  const { data: jobs, isLoading: jobsLoading } = useJobs()
  const { data: analyses, isLoading: analysesLoading } = useAnalyses()

  const stats = [
    {
      title: "Uploaded Resumes",
      value: resumes?.length || 0,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Generated Resumes",
      value: generatedResumes?.meta?.total || 0,
      icon: Sparkles,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Saved Jobs",
      value: jobs?.length || 0,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Analyses Run",
      value: analyses?.length || 0,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const recentActivity = [
    ...(resumes || []).map((r) => ({
      id: r.id,
      title: r.fileName,
      type: "uploaded" as const,
      date: r.uploadedAt,
    })),
    ...(generatedResumes?.data || []).map((r) => ({
      id: r.id,
      title: r.title,
      type: "generated" as const,
      date: r.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const isLoading = resumesLoading || generatedLoading || jobsLoading || analysesLoading

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your job search progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 flex items-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full justify-start h-12">
              <Link to="/resumes/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/resume-builder">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Professional Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link to="/jobs/new">
                <Target className="mr-2 h-4 w-4" />
                Add Job Description
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/resumes">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 group">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${item.type === 'uploaded' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                      {item.type === 'uploaded' ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                      {item.type === 'uploaded' ? (
                        <Link to="/resumes">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <Link to="/resume-builder/$id/edit" params={{ id: item.id }}>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activity</p>
                <Button asChild variant="link" className="mt-2">
                  <Link to="/resumes/upload">Upload your first resume</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
