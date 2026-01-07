import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Target, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Optimize Your Resume. Match Better. Get Hired Faster.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            An AI-powered platform to analyze resume quality, match against job descriptions, 
            and get actionable recommendations—completely free.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent z-10 pointer-events-none" />
          <div className="mx-auto max-w-5xl rounded-xl border bg-card p-4 shadow-xl">
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-muted-foreground ml-2">Tanalyze Dashboard</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Resumes</span>
                </div>
                <p className="text-sm text-muted-foreground">12 uploaded</p>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4" />
                </div>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Jobs</span>
                </div>
                <p className="text-sm text-muted-foreground">8 saved</p>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2" />
                </div>
              </div>
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Match Score</span>
                </div>
                <p className="text-sm text-muted-foreground">85% average</p>
                <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
