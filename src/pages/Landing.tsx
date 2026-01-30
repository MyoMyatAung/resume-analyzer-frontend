/*
 Landing page refactor: pricing section removed.
 Rationale: adhere to SRP; reduce initial payload; keep landing focused on conversion messaging.
 Pricing.tsx is removed to avoid dead code; navigation to pricing is removed from Footer.
 This patch keeps the landing page lean and maintainable.
*/
import { Hero } from "@/components/features/landing/Hero"
import { Features } from "@/components/features/landing/Features"
import { FAQ, faqs } from "@/components/features/landing/FAQ"
import { CTASection } from "@/components/features/landing/CTASection"
import { Footer } from "@/components/layout/Footer"
import { useSEO, structuredData } from "@/hooks/useSEO"

export function Landing() {
  // SEO configuration for the landing page
  useSEO({
    title: "Tanalyze - AI-Powered Resume Analysis & Job Matching",
    description:
      "Optimize your resume, match better with jobs, and get hired faster. Free AI-powered resume analysis using Google Gemini. ATS optimization and job matching.",
    keywords:
      "resume analysis, AI resume checker, job matching, ATS optimization, resume improvement, free resume analysis, resume scorer, job application tool, career tools",
    canonicalUrl: "https://tanalyze.com",
    structuredData: [
      structuredData.organization(),
      structuredData.website(),
      structuredData.webApplication(),
      structuredData.faqPage(faqs),
    ],
  })

  return (
    <div className="flex-1">
      <Hero />
      <Features />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  )
}
