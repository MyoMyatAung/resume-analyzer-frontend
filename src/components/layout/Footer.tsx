import { Link } from "@tanstack/react-router"
import { Github, Twitter, Linkedin } from "lucide-react"
import logo from "@/assets/logo.svg"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          { /* Pricing UI removed from landing to maintain simplified consumer flow */ }
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Tanalyze" className="h-9 w-auto" />
              <span className="text-xl font-bold">Tanalyze</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Optimize your resume, match better with jobs, and get hired faster with AI-powered analysis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link to="/" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © 2024 Tanalyze. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
