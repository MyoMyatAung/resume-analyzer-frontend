import { useEffect } from "react"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: "website" | "article"
  twitterCard?: "summary" | "summary_large_image"
  noIndex?: boolean
  structuredData?: object | object[]
}

const DEFAULT_TITLE = "Tanalyze - AI-Powered Resume Analysis & Job Matching"
const DEFAULT_DESCRIPTION =
  "Optimize your resume, match better with jobs, and get hired faster. Free AI-powered resume analysis using Google Gemini. ATS optimization and job matching."
const SITE_URL = "https://tanalyze.com"

/**
 * Custom SEO hook for managing meta tags and structured data
 * Works with React 19 without external dependencies
 */
export function useSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalUrl,
  ogImage = `${SITE_URL}/og-image.jpg`,
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  structuredData,
}: SEOProps = {}) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name"
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
      
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Update basic meta tags
    setMeta("description", description)
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow")

    if (keywords) {
      setMeta("keywords", keywords)
    }

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl || SITE_URL

    // Open Graph tags
    setMeta("og:title", title, true)
    setMeta("og:description", description, true)
    setMeta("og:type", ogType, true)
    setMeta("og:url", canonicalUrl || SITE_URL, true)
    setMeta("og:image", ogImage, true)
    setMeta("og:site_name", "Tanalyze", true)

    // Twitter Card tags
    setMeta("twitter:card", twitterCard)
    setMeta("twitter:title", title)
    setMeta("twitter:description", description)
    setMeta("twitter:image", ogImage)

    // Handle structured data (JSON-LD)
    // Remove any existing dynamic structured data
    const existingScripts = document.querySelectorAll('script[data-seo="dynamic"]')
    existingScripts.forEach((script) => script.remove())

    if (structuredData) {
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData]
      dataArray.forEach((data, index) => {
        const script = document.createElement("script")
        script.type = "application/ld+json"
        script.setAttribute("data-seo", "dynamic")
        script.setAttribute("data-seo-index", String(index))
        script.textContent = JSON.stringify(data)
        document.head.appendChild(script)
      })
    }

    // Cleanup function
    return () => {
      // Reset to defaults when component unmounts
      document.title = DEFAULT_TITLE
      const dynamicScripts = document.querySelectorAll('script[data-seo="dynamic"]')
      dynamicScripts.forEach((script) => script.remove())
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, noIndex, structuredData])
}

/**
 * Pre-built structured data generators for common schema types
 */
export const structuredData = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tanalyze",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media links here when available
      // "https://twitter.com/tanalyze",
      // "https://linkedin.com/company/tanalyze",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
    },
  }),

  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tanalyze",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }),

  webApplication: () => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tanalyze",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free AI-powered resume analysis",
    },
    featureList: [
      "AI-powered resume analysis",
      "Job description matching",
      "ATS compatibility scoring",
      "Skill gap identification",
      "Resume improvement suggestions",
    ],
  }),

  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
}
