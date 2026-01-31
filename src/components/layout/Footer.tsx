import logo from "@/assets/logo.svg"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <img src={logo} alt="Tanalyze" className="h-9 w-auto" />
              <span className="text-xl font-bold">Tanalyze</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Optimize your resume, match better with jobs, and get hired faster with AI-powered analysis.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Tanalyze. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
