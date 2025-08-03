"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Enhanced mock audience tracker data with demographics and response rates
const initialAudienceData = [
  { date: "2024-06-01", newFollowers: 120, unfollows: 30 },
  { date: "2024-06-02", newFollowers: 150, unfollows: 20 },
  { date: "2024-06-03", newFollowers: 180, unfollows: 25 },
  { date: "2024-06-04", newFollowers: 200, unfollows: 15 },
  { date: "2024-06-05", newFollowers: 170, unfollows: 10 },
  { date: "2024-06-06", newFollowers: 190, unfollows: 5 },
  { date: "2024-06-07", newFollowers: 210, unfollows: 8 },
]

const demographics = {
  ageGroups: [
    { label: "18-24", value: 40 },
    { label: "25-34", value: 35 },
    { label: "35-44", value: 15 },
    { label: "45-54", value: 7 },
    { label: "55+", value: 3 },
  ],
  locations: [
    { label: "New York", value: 25 },
    { label: "Los Angeles", value: 20 },
    { label: "Chicago", value: 15 },
    { label: "Houston", value: 10 },
    { label: "Other", value: 30 },
  ],
  phoneNumbers: [
    "123-456-7890",
    "234-567-8901",
    "345-678-9012",
  ],
  emails: [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
  ]
}

export function EnhancedAudienceTracker() {
  const [audienceData, setAudienceData] = useState(initialAudienceData)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience Tracker</CardTitle>
          <CardDescription>Track audience growth, demographics, and response rates</CardDescription>
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

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium">Age Groups</h4>
                <ul className="list-disc list-inside">
                  {demographics.ageGroups.map((group) => (
                    <li key={group.label}>{group.label}: {group.value}%</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Locations</h4>
                <ul className="list-disc list-inside">
                  {demographics.locations.map((loc) => (
                    <li key={loc.label}>{loc.label}: {loc.value}%</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Contact Info</h4>
                <p>Phone Numbers:</p>
                <ul className="list-disc list-inside">
                  {demographics.phoneNumbers.map((phone, idx) => (
                    <li key={idx}>{phone}</li>
                  ))}
                </ul>
                <p>Emails:</p>
                <ul className="list-disc list-inside">
                  {demographics.emails.map((email, idx) => (
                    <li key={idx}>{email}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
