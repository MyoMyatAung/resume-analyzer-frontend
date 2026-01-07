import { Link } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useResumes } from "@/hooks/useResumes"
import { useJobs } from "@/hooks/useJobs"
import { FileText, Target, TrendingUp, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/shared/LoadingSpinner"

export function Dashboard() {
  const { user } = useAuthStore()
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: jobs, isLoading: jobsLoading } = useJobs()

  const stats = [
    {
      title: "Total Resumes",
      value: resumes?.length || 0,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
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
      value: 0,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your job search progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {resumesLoading || jobsLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full justify-start">
              <Link to="/resumes/upload">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/jobs/new">
                <Target className="mr-2 h-4 w-4" />
                Create Job Description
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {resumesLoading ? (
              <LoadingSpinner />
            ) : resumes && resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.slice(0, 3).map((resume) => (
                  <div key={resume.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{resume.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No resumes yet</p>
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
