"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Insights {
  creativeFatigue: number
  audienceSaturation: number
  budgetUnderutilization: number
  dailyNotes: string[]
}

const mockInsights: Insights = {
  creativeFatigue: 0.65, // 65% fatigued
  audienceSaturation: 0.45, // 45% saturated
  budgetUnderutilization: 0.30, // 30% underutilized
  dailyNotes: [
    "Your lookalike audience is converting 37% lower than retargeting — consider scaling down.",
    "Creative fatigue detected on Campaign X — consider refreshing ad creatives.",
    "Budget utilization is below 70% on TikTok Ads — consider reallocating budget."
  ]
}

export function AIPoweredCampaignInsights() {
  const [insights, setInsights] = useState<Insights | null>(null)

  useEffect(() => {
    // Simulate fetching AI insights
    setTimeout(() => {
      setInsights(mockInsights)
    }, 1000)
  }, [])

  if (!insights) {
    return <p>Loading AI Campaign Insights...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Campaign Insights</CardTitle>
        <CardDescription>Automatic detection of campaign health and daily AI notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Campaign Health Metrics</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-1">Creative Fatigue</p>
              <Progress value={insights.creativeFatigue * 100} className="h-4" />
            </div>
            <div>
              <p className="mb-1">Audience Saturation</p>
              <Progress value={insights.audienceSaturation * 100} className="h-4" />
            </div>
            <div>
              <p className="mb-1">Budget Underutilization</p>
              <Progress value={insights.budgetUnderutilization * 100} className="h-4" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Daily AI Notes</h3>
          <ul className="list-disc list-inside space-y-1">
            {insights.dailyNotes.map((note: string, idx: number) => (
              <li key={idx} className="flex items-center space-x-2">
                <AlertCircle className="text-yellow-500" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
