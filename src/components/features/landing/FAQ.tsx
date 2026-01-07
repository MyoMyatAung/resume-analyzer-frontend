import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is Tanalyze really free?",
    answer: "Yes, Tanalyze offers core features for free using Google Gemini's free tier. You can upload unlimited resumes, get quality analysis, and match against job descriptions without paying.",
  },
  {
    question: "What file formats are supported?",
    answer: "Currently, we support PDF files only, with a maximum size of 5MB. This ensures optimal text extraction and compatibility with our AI analysis.",
  },
  {
    question: "How does the AI analysis work?",
    answer: "Tanalyze uses Google Gemini 1.5 Flash, a powerful AI model, to analyze your resume. It evaluates skill coverage, experience relevance, ATS compatibility, and clarity structure to provide actionable insights.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, your data is secure. Resumes are stored in AWS S3 with encryption, and we follow industry best practices for token management and data protection.",
  },
  {
    question: "Can I analyze my resume without a job description?",
    answer: "Absolutely! You can use our standalone Resume Quality Analysis feature to get detailed feedback on your resume without needing a specific job description.",
  },
]

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Got questions? We've got answers.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
