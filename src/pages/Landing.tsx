import { Hero } from "@/components/features/landing/Hero"
import { Features } from "@/components/features/landing/Features"
import { FAQ } from "@/components/features/landing/FAQ"
import { Pricing } from "@/components/features/landing/Pricing"
import { CTASection } from "@/components/features/landing/CTASection"

export function Landing() {
  return (
    <div className="flex-1">
      <Hero />
      <Features />
      <FAQ />
      <Pricing />
      <CTASection />
    </div>
  )
}
