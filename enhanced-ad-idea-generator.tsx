"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

// Enhanced mock AI-powered ad idea data
const initialAdIdeas = [
  { id: 1, title: "Summer Sale Campaign", description: "Promote summer discounts on all products.", platform: "Instagram", targetAudience: "18-35, fashion lovers" },
  { id: 2, title: "New Product Launch", description: "Highlight features of the new product line.", platform: "Facebook", targetAudience: "25-45, tech enthusiasts" },
  { id: 3, title: "Customer Testimonials", description: "Showcase positive customer reviews.", platform: "YouTube", targetAudience: "All ages, general audience" },
  { id: 4, title: "Holiday Specials", description: "Advertise special offers for the holiday season.", platform: "TikTok", targetAudience: "18-30, trend followers" },
]

export function EnhancedAdIdeaGenerator() {
  const [adIdeas, setAdIdeas] = useState(initialAdIdeas)
  const [aiSuggestion, setAiSuggestion] = useState("Generating AI suggestions...")

  useEffect(() => {
    // Simulate AI suggestion generation
    setTimeout(() => {
      setAiSuggestion("AI Suggestion: Try video ads with influencer collaborations for higher engagement.")
    }, 2000)
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Idea Generator</CardTitle>
          <CardDescription>AI-powered creative ad ideas with targeting info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adIdeas.map((idea) => (
              <div key={idea.id} className="space-y-1 border p-3 rounded shadow-sm">
                <h3 className="font-semibold">{idea.title} <Lightbulb className="inline h-5 w-5 text-yellow-500" /></h3>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
                <p className="text-xs text-muted-foreground">Platform: {idea.platform}</p>
                <p className="text-xs text-muted-foreground">Target Audience: {idea.targetAudience}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded text-blue-700">
            <strong>AI Insight:</strong> {aiSuggestion}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
