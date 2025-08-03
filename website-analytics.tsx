"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Mock website analytics data
const websiteData = [
  { date: "2024-06-01", visitors: 1200, bounceRate: 40 },
  { date: "2024-06-02", visitors: 1500, bounceRate: 35 },
  { date: "2024-06-03", visitors: 1800, bounceRate: 30 },
  { date: "2024-06-04", visitors: 2000, bounceRate: 25 },
  { date: "2024-06-05", visitors: 1700, bounceRate: 28 },
  { date: "2024-06-06", visitors: 1900, bounceRate: 22 },
  { date: "2024-06-07", visitors: 2100, bounceRate: 20 },
]

export function WebsiteAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Website Analytics</CardTitle>
        <CardDescription>Track website visitors and bounce rate</CardDescription>
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
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
