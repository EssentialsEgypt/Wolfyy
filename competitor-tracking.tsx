"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

// Mock competitor data
const competitors = [
  { name: "Brand A", marketShare: 35, change: 2.5, trend: "up" },
  { name: "Brand B", marketShare: 25, change: -1.2, trend: "down" },
  { name: "Brand C", marketShare: 20, change: 0.5, trend: "up" },
  { name: "Brand D", marketShare: 15, change: -0.8, trend: "down" },
  { name: "Brand E", marketShare: 5, change: 0, trend: "neutral" },
]

export function CompetitorTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Market Share</CardTitle>
        <CardDescription>Overview of competitor market share and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Market Share (%)</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((competitor, index) => (
              <TableRow key={index}>
                <TableCell>{competitor.name}</TableCell>
                <TableCell>{competitor.marketShare}</TableCell>
                <TableCell>
                  <span className={`flex items-center ${competitor.trend === "up" ? "text-green-600" : competitor.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                    {competitor.trend === "up" && <TrendingUp className="h-4 w-4 mr-1" />}
                    {competitor.trend === "down" && <TrendingDown className="h-4 w-4 mr-1" />}
                    {competitor.change}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
