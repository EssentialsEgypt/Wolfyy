"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

// Mock ad idea data
const adIdeas = [
  { id: 1, title: "Summer Sale Campaign", description: "Promote summer discounts on all products." },
  { id: 2, title: "New Product Launch", description: "Highlight features of the new product line." },
  { id: 3, title: "Customer Testimonials", description: "Showcase positive customer reviews." },
  { id: 4, title: "Holiday Specials", description: "Advertise special offers for the holiday season." },
]

export function AdIdeaGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Idea Generator</CardTitle>
        <CardDescription>Generate creative ad ideas for campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {adIdeas.map((idea) => (
            <div key={idea.id} className="space-y-1">
              <h3 className="font-semibold">{idea.title}</h3>
              <p className="text-sm text-muted-foreground">{idea.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
