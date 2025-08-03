"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Enhanced mock website analytics data with referral sources and conversion metrics
const initialWebsiteData = [
  { date: "2024-06-01", visitors: 1200, bounceRate: 40, conversions: 50 },
  { date: "2024-06-02", visitors: 1500, bounceRate: 35, conversions: 65 },
  { date: "2024-06-03", visitors: 1800, bounceRate: 30, conversions: 70 },
  { date: "2024-06-04", visitors: 2000, bounceRate: 25, conversions: 80 },
  { date: "2024-06-05", visitors: 1700, bounceRate: 28, conversions: 60 },
  { date: "2024-06-06", visitors: 1900, bounceRate: 22, conversions: 75 },
  { date: "2024-06-07", visitors: 2100, bounceRate: 20, conversions: 85 },
]

const referralSources = [
  { source: "Facebook", percentage: 35 },
  { source: "Instagram", percentage: 25 },
  { source: "Google", percentage: 20 },
  { source: "Direct", percentage: 15 },
  { source: "Other", percentage: 5 },
]

export function EnhancedWebsiteAnalytics() {
  const [websiteData, setWebsiteData] = useState(initialWebsiteData)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Analytics</CardTitle>
          <CardDescription>Track website visitors, bounce rate, referrals, and conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={websiteData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="#8884d8" name="Visitors" />
              <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#82ca9d" name="Bounce Rate (%)" />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#ffc658" name="Conversions" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Referral Sources</h3>
            <ul className="list-disc list-inside">
              {referralSources.map((ref) => (
                <li key={ref.source}>{ref.source}: {ref.percentage}%</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
