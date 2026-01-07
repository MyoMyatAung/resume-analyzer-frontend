import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Search, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "AI Resume Analysis",
    description: "Get instant feedback on skill coverage, ATS compatibility, and clarity structure with detailed metrics.",
  },
  {
    icon: Search,
    title: "Smart Job Matching",
    description: "Compare your resume against job postings to see your match score and identify opportunities.",
  },
  {
    icon: TrendingUp,
    title: "Gap Detection",
    description: "Know exactly what skills and keywords you're missing with actionable improvement suggestions.",
  },
  {
    icon: CheckCircle,
    title: "ATS Optimization",
    description: "Pass applicant tracking systems with keyword optimization and formatting recommendations.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground mt-2">Everything you need to optimize your job search</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
