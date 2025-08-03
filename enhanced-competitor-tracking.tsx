"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

// Enhanced mock competitor data with viral posts and clickable previews
const initialCompetitors = [
  {
    id: 1,
    name: "Brand A",
    marketShare: 35,
    change: 2.5,
    trend: "up",
    viralPosts: [
      {
        id: "a1",
        title: "Viral Reel: Summer Campaign",
        url: "https://www.instagram.com/p/viralreelA1",
        thumbnail: "https://via.placeholder.com/100x60?text=Reel+A1"
      }
    ]
  },
  {
    id: 2,
    name: "Brand B",
    marketShare: 25,
    change: -1.2,
    trend: "down",
    viralPosts: [
      {
        id: "b1",
        title: "Trending TikTok Dance",
        url: "https://www.tiktok.com/@brandb/video/viralb1",
        thumbnail: "https://via.placeholder.com/100x60?text=TikTok+B1"
      }
    ]
  },
  {
    id: 3,
    name: "Brand C",
    marketShare: 20,
    change: 0.5,
    trend: "up",
    viralPosts: []
  },
  {
    id: 4,
    name: "Brand D",
    marketShare: 15,
    change: -0.8,
    trend: "down",
    viralPosts: []
  },
  {
    id: 5,
    name: "Brand E",
    marketShare: 5,
    change: 0,
    trend: "neutral",
    viralPosts: []
  }
]

export function EnhancedCompetitorTracking() {
  const [competitors, setCompetitors] = useState(initialCompetitors)

  // Placeholder for future data fetching or AI insights

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Market Share & Viral Content</CardTitle>
        <CardDescription>Overview of competitor market share, trends, and viral posts</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Market Share (%)</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Viral Posts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor) => (
              <TableRow key={competitor.id}>
                <TableCell>{competitor.name}</TableCell>
                <TableCell>{competitor.marketShare}</TableCell>
                <TableCell>
                  <span className={`flex items-center ${
                    competitor.trend === "up" ? "text-green-600" :
                    competitor.trend === "down" ? "text-red-600" : "text-gray-600"
                  }`}>
                    {competitor.trend === "up" && <TrendingUp className="h-4 w-4 mr-1" />}
                    {competitor.trend === "down" && <TrendingDown className="h-4 w-4 mr-1" />}
                    {competitor.change}%
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 overflow-x-auto">
                    {competitor.viralPosts.length === 0 && <span className="text-muted-foreground">No viral posts</span>}
                    {competitor.viralPosts.map((post) => (
                      <a
                        key={post.id}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border rounded p-1 hover:shadow-md"
                        title={post.title}
                      >
                        <img src={post.thumbnail} alt={post.title} className="w-24 h-14 object-cover rounded" />
                      </a>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
