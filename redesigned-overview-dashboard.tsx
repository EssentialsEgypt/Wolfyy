"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from "recharts"
import { Users, DollarSign, TrendingUp, TrendingDown, ShoppingCart, Percent } from "lucide-react"

const dateRanges = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Custom", value: "custom" },
]

// Mock KPI data
const kpis = [
  { id: "revenue", title: "Revenue", value: "$120,000", icon: DollarSign },
  { id: "roas", title: "ROAS", value: "4.5x", icon: TrendingUp },
  { id: "adSpend", title: "Ad Spend", value: "$26,000", icon: DollarSign },
  { id: "orders", title: "Total Orders", value: "1,200", icon: ShoppingCart },
  { id: "conversionRate", title: "Conversion Rate", value: "3.2%", icon: Percent },
]

// Mock trendline data
const trendlineData = [
  { date: "2024-06-01", revenue: 4000, spend: 800, roas: 5 },
  { date: "2024-06-02", revenue: 4500, spend: 900, roas: 5 },
  { date: "2024-06-03", revenue: 4200, spend: 850, roas: 4.9 },
  { date: "2024-06-04", revenue: 4800, spend: 950, roas: 5.1 },
  { date: "2024-06-05", revenue: 5000, spend: 1000, roas: 5 },
  { date: "2024-06-06", revenue: 5300, spend: 1100, roas: 4.8 },
  { date: "2024-06-07", revenue: 5500, spend: 1150, roas: 4.7 },
]

// Mock top platforms data
const topPlatforms = [
  { id: "facebook", name: "Facebook", reach: "1.2M", cpr: "15 EGP", conversions: 320 },
  { id: "instagram", name: "Instagram", reach: "900K", cpr: "12 EGP", conversions: 280 },
  { id: "tiktok", name: "TikTok", reach: "700K", cpr: "10 EGP", conversions: 250 },
]

// Mock competitor monitoring data
const initialCompetitors = [
  { id: 1, username: "competitor1", domain: "competitor1.com", latestAds: 5, followerGrowth: "3.5%", topHashtags: ["#marketing", "#socialmedia", "#branding"] },
  { id: 2, username: "competitor2", domain: "competitor2.com", latestAds: 3, followerGrowth: "2.1%", topHashtags: ["#ads", "#growth", "#campaign"] },
]

// Mock most used content angles data
const contentAngles = [
  { id: 1, angle: "Emotional Appeal", usageCount: 120 },
  { id: 2, angle: "Product Benefits", usageCount: 95 },
  { id: 3, angle: "User Testimonials", usageCount: 80 },
]

export function RedesignedOverviewDashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState("7d")
  const [competitors, setCompetitors] = useState(initialCompetitors)
  const [newCompetitorUsername, setNewCompetitorUsername] = useState("")
  const [newCompetitorDomain, setNewCompetitorDomain] = useState("")

  const addCompetitor = () => {
    if (!newCompetitorUsername.trim() || !newCompetitorDomain.trim()) return
    const newCompetitor = {
      id: Date.now(),
      username: newCompetitorUsername.trim(),
      domain: newCompetitorDomain.trim(),
      latestAds: 0,
      followerGrowth: "0%",
      topHashtags: [],
    }
    setCompetitors((prev) => [newCompetitor, ...prev])
    setNewCompetitorUsername("")
    setNewCompetitorDomain("")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Date Range Picker */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview Dashboard</h2>
        <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.id} className="flex items-center space-x-4 p-4">
            <kpi.icon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <p className="text-xl font-semibold">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Trendline Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Spend vs ROAS</CardTitle>
          <CardDescription>Date range: {dateRanges.find((d) => d.value === selectedDateRange)?.label}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendlineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar yAxisId="left" dataKey="spend" fill="#ef4444" name="Spend" />
              <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#10b981" name="ROAS" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top 3 Performing Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topPlatforms.map((platform) => (
          <Card key={platform.id} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{platform.name}</h3>
            <p>Reach: {platform.reach}</p>
            <p>CPR: {platform.cpr}</p>
            <p>Conversions: {platform.conversions}</p>
          </Card>
        ))}
      </div>

      {/* Competitor Monitoring Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Monitoring Panel</CardTitle>
          <CardDescription>Enter competitors’ usernames or domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
            <input
              type="text"
              placeholder="Username"
              value={newCompetitorUsername}
              onChange={(e) => setNewCompetitorUsername(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <input
              type="text"
              placeholder="Domain"
              value={newCompetitorDomain}
              onChange={(e) => setNewCompetitorDomain(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
            />
            <Button onClick={addCompetitor} className="whitespace-nowrap">
              Add Competitor
            </Button>
          </div>
          {competitors.length === 0 ? (
            <p>No competitors added yet.</p>
          ) : (
            <div className="space-y-4">
              {competitors.map((comp) => (
                <Card key={comp.id} className="p-4">
                  <h4 className="font-semibold mb-2">
                    {comp.username} ({comp.domain})
                  </h4>
                  <p>Latest ads from Meta Ad Library: {comp.latestAds}</p>
                  <p>Follower growth rate: {comp.followerGrowth}</p>
                  <p>Top performing hashtags: {comp.topHashtags.join(", ")}</p>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Most Used Content Angles */}
      <Card>
        <CardHeader>
          <CardTitle>Most Used Content Angles</CardTitle>
          <CardDescription>Top content angles used in campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {contentAngles.map((angle) => (
              <li key={angle.id}>
                {angle.angle} - {angle.usageCount} uses
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Goal Tracking Bar */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">EGP 1,000,000 Monthly Revenue Target</h3>
        <div className="w-full bg-gray-300 rounded-full h-6">
          <div className="bg-green-500 h-6 rounded-full" style={{ width: "68%" }}></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">68% Achieved</p>
      </Card>

      {/* Status Alerts */}
      <div className="space-y-2">
        <div className="p-4 bg-red-100 text-red-700 rounded">⚠️ CPR is above target on TikTok Ads</div>
        <div className="p-4 bg-green-100 text-green-700 rounded">✅ Revenue target exceeded for Facebook</div>
      </div>
    </div>
  )
}
