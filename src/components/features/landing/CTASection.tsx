import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to supercharge your job search?</h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join thousands of job seekers who have improved their resumes and landed more interviews.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/register">Upload Your Resume Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign Up with Google/GitHub</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
