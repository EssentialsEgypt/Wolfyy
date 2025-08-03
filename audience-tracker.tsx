"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Mock audience tracker data
const audienceData = [
  { date: "2024-06-01", newFollowers: 120, unfollows: 30 },
  { date: "2024-06-02", newFollowers: 150, unfollows: 20 },
  { date: "2024-06-03", newFollowers: 180, unfollows: 25 },
  { date: "2024-06-04", newFollowers: 200, unfollows: 15 },
  { date: "2024-06-05", newFollowers: 170, unfollows: 10 },
  { date: "2024-06-06", newFollowers: 190, unfollows: 5 },
  { date: "2024-06-07", newFollowers: 210, unfollows: 8 },
]

export function AudienceTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Tracker</CardTitle>
        <CardDescription>Track your audience growth and retention</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={audienceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="newFollowers" stroke="#8884d8" name="New Followers" />
            <Line type="monotone" dataKey="unfollows" stroke="#82ca9d" name="Unfollows" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
