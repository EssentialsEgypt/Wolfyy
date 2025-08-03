"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

// Enhanced mock content hub data with scheduling, auto-replies, and engagement stats
const initialContentItems = [
  { id: 1, title: "Blog Post: Social Media Trends 2024", date: "2024-06-01", status: "Published", platform: "Blog", engagement: 1200 },
  { id: 2, title: "Video: How to Boost Engagement", date: "2024-06-05", status: "Draft", platform: "YouTube", engagement: 0 },
  { id: 3, title: "Infographic: Audience Demographics", date: "2024-06-10", status: "Scheduled", platform: "Instagram", engagement: 0 },
  { id: 4, title: "Podcast: Marketing Strategies", date: "2024-06-15", status: "Published", platform: "Spotify", engagement: 800 },
]

const autoReplies = [
  { id: 1, trigger: "Thank you", message: "Thanks for reaching out! We'll get back to you shortly." },
  { id: 2, trigger: "Price", message: "Please visit our pricing page for detailed info." },
  { id: 3, trigger: "Support", message: "Our support team is here to help you 24/7." },
]

export function EnhancedContentHub() {
  const [contentItems, setContentItems] = useState(initialContentItems)
  const [replies, setReplies] = useState(autoReplies)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Hub</CardTitle>
          <CardDescription>Manage and track your content calendar and auto-replies</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Engagement</TableHead>
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
                  <TableCell>{item.platform}</TableCell>
                  <TableCell>{item.engagement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto Replies</CardTitle>
          <CardDescription>Manage automated response templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trigger</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {replies.map((reply) => (
                <TableRow key={reply.id}>
                  <TableCell>{reply.trigger}</TableCell>
                  <TableCell>{reply.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
