"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Mock ad performance data
const adPerformanceData = [
  { name: "Campaign 1", clicks: 400, impressions: 2400, conversions: 240 },
  { name: "Campaign 2", clicks: 300, impressions: 1398, conversions: 221 },
  { name: "Campaign 3", clicks: 200, impressions: 9800, conversions: 229 },
  { name: "Campaign 4", clicks: 278, impressions: 3908, conversions: 200 },
  { name: "Campaign 5", clicks: 189, impressions: 4800, conversions: 218 },
]

export function AdPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ad Performance</CardTitle>
        <CardDescription>Overview of ad campaign performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={adPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
      </CardContent>
    </Card>
  )
}
