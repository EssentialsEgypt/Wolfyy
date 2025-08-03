"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

// Mock content hub data
const contentItems = [
  { id: 1, title: "Blog Post: Social Media Trends 2024", date: "2024-06-01", status: "Published" },
  { id: 2, title: "Video: How to Boost Engagement", date: "2024-06-05", status: "Draft" },
  { id: 3, title: "Infographic: Audience Demographics", date: "2024-06-10", status: "Scheduled" },
  { id: 4, title: "Podcast: Marketing Strategies", date: "2024-06-15", status: "Published" },
]

export function ContentHub() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Hub</CardTitle>
        <CardDescription>Manage and track your content calendar</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "Published" ? "secondary" : item.status === "Draft" ? "outline" : "destructive"}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
