"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Enhanced mock ad performance data with multi-platform tracking and alerts
const initialAdPerformanceData = [
  { id: 1, name: "Facebook Campaign", platform: "Facebook", clicks: 400, impressions: 2400, conversions: 240, cpa: 5.2, roas: 3.5 },
  { id: 2, name: "Instagram Campaign", platform: "Instagram", clicks: 300, impressions: 1398, conversions: 221, cpa: 4.8, roas: 4.0 },
  { id: 3, name: "Google Ads", platform: "Google", clicks: 200, impressions: 9800, conversions: 229, cpa: 6.1, roas: 2.8 },
  { id: 4, name: "TikTok Ads", platform: "TikTok", clicks: 278, impressions: 3908, conversions: 200, cpa: 5.5, roas: 3.2 },
  { id: 5, name: "Snapchat Ads", platform: "Snapchat", clicks: 189, impressions: 4800, conversions: 218, cpa: 5.0, roas: 3.7 },
]

export function EnhancedAdPerformance() {
  const [adData, setAdData] = useState(initialAdPerformanceData)

  // Placeholder for alert logic (e.g., CPA spikes, budget caps)
  const alerts = adData.filter(ad => ad.cpa > 5.5)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ad Performance</CardTitle>
          <CardDescription>Multi-platform ad campaign tracking and optimization suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={adData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#8884d8" />
              <Bar dataKey="impressions" fill="#82ca9d" />
              <Bar dataKey="conversions" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          {alerts.length > 0 && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              <strong>Alerts:</strong>
              <ul className="list-disc list-inside">
                {alerts.map(ad => (
                  <li key={ad.id}>
                    {ad.name} has a high CPA of ${ad.cpa.toFixed(2)}. Consider pausing or optimizing this campaign.
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
