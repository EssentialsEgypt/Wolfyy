"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye, DollarSign } from "lucide-react"

// Mock data
const engagementData = [
  { name: "Mon", engagement: 4200, reach: 8500 },
  { name: "Tue", engagement: 3800, reach: 7200 },
  { name: "Wed", engagement: 5200, reach: 9800 },
  { name: "Thu", engagement: 4600, reach: 8900 },
  { name: "Fri", engagement: 6100, reach: 11200 },
  { name: "Sat", engagement: 7200, reach: 13500 },
  { name: "Sun", engagement: 5800, reach: 10800 }
]

const platformData = [
  { name: "Instagram", value: 35, color: "#E4405F" },
  { name: "Facebook", value: 28, color: "#1877F2" },
  { name: "Twitter", value: 20, color: "#1DA1F2" },
  { name: "TikTok", value: 17, color: "#000000" }
]

const kpiCards = [
  {
    title: "Total Followers",
    value: "124.5K",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month"
  },
  {
    title: "Engagement Rate",
    value: "4.8%",
    change: "+0.8%",
    trend: "up",
    icon: Heart,
    description: "avg across platforms"
  },
  {
    title: "Total Reach",
    value: "2.1M",
    change: "-2.1%",
    trend: "down",
    icon: Eye,
    description: "this month"
  },
  {
    title: "Revenue",
    value: "$18,420",
    change: "+24.3%",
    trend: "up",
    icon: DollarSign,
    description: "from social campaigns"
  }
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={`flex items-center ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </span>
                <span className="ml-1">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement & Reach</CardTitle>
            <CardDescription>Engagement and reach metrics for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#8884d8" name="Engagement" />
                <Bar dataKey="reach" fill="#82ca9d" name="Reach" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Follower distribution across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest social media activities and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Instagram post reached 10K likes</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">High Engagement</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New Facebook campaign launched</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <Badge variant="outline">Campaign</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">TikTok video went viral - 50K views</p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
              <Badge variant="secondary">Viral</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Competitor analysis completed</p>
                <p className="text-xs text-muted-foreground">8 hours ago</p>
              </div>
              <Badge variant="outline">Analysis</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
