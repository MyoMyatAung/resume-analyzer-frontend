import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Link } from "@tanstack/react-router"

const freeFeatures = [
  "Unlimited resume uploads",
  "Resume quality analysis",
  "Basic job matching",
  "100 API requests/day",
  "Community access",
]

const proFeatures = [
  "Everything in Free",
  "Priority AI processing",
  "Unlimited job matches",
  "Advanced insights export",
  "Dedicated support",
  "Early access to new features",
]

export function Pricing() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-2">Start for free, upgrade when you need more</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>For individuals getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/register">Get Started Free</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              </div>
              <CardDescription>For serious job seekers</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/register">Upgrade to Pro</Link>
                </Button>
              </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
