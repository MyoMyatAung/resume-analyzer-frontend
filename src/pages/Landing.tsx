/*
 Landing page refactor: pricing section removed.
 Rationale: adhere to SRP; reduce initial payload; keep landing focused on conversion messaging.
 Pricing.tsx is removed to avoid dead code; navigation to pricing is removed from Footer.
 This patch keeps the landing page lean and maintainable.
*/
import { Hero } from "@/components/features/landing/Hero"
import { Features } from "@/components/features/landing/Features"
import { FAQ } from "@/components/features/landing/FAQ"
import { CTASection } from "@/components/features/landing/CTASection"
import { Footer } from "@/components/layout/Footer"

export function Landing() {
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
