"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import ErrorBoundary from "@/components/ui/error-boundary"

const enableNewAutoMessageUI = true

interface AutoMessage {
  id: number
  trigger: string
  message: string
  active: boolean
  slackEnabled: boolean
  whatsappEnabled: boolean
  emailEnabled: boolean
}

export function AutoMessages() {
  const [autoMessages, setAutoMessages] = useState<AutoMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchAutoMessages() {
      try {
        setLoading(true)
        setError(null)
        // Replace with real API endpoint to fetch auto messages config
        const res = await fetch('/api/auto-messages')
        if (!res.ok) throw new Error('Failed to fetch auto messages')
        const data = await res.json()
        setAutoMessages(data.messages)
      } catch (err: any) {
        setError(err.message || 'Error loading auto messages')
      } finally {
        setLoading(false)
      }
    }
    fetchAutoMessages()
  }, [])

  async function toggleChannel(id: number, channel: 'slack' | 'whatsapp' | 'email', enabled: boolean) {
    try {
      setUpdatingId(id)
      // Call backend API to update channel enable/disable status
      const res = await fetch(`/api/auto-messages/${id}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, enabled }),
      })
      if (!res.ok) throw new Error('Failed to update channel status')
      // Update local state optimistically
      setAutoMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                slackEnabled: channel === 'slack' ? enabled : msg.slackEnabled,
                whatsappEnabled: channel === 'whatsapp' ? enabled : msg.whatsappEnabled,
                emailEnabled: channel === 'email' ? enabled : msg.emailEnabled,
              }
            : msg
        )
      )
      toast.success(`Updated ${channel} alert for "${autoMessages.find(m => m.id === id)?.trigger}"`)
    } catch (err: any) {
      toast.error(err.message || 'Error updating channel')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleTestAlert(id: number, channel: 'slack' | 'whatsapp' | 'email') {
    try {
      const msg = autoMessages.find(m => m.id === id)
      if (!msg) throw new Error('Message not found')
      const res = await fetch(`/api/integrations/${channel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channel === 'slack' ? '#ad-performance' : undefined,
          toNumber: channel === 'whatsapp' ? '+1234567890' : undefined,
          toEmails: channel === 'email' ? ['cmo@example.com'] : undefined,
          text: msg.message,
          subject: channel === 'email' ? `Test Alert: ${msg.trigger}` : undefined,
          htmlContent: channel === 'email' ? `<p>${msg.message}</p>` : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to send test alert')
      toast.success(`Test alert sent via ${channel} for "${msg.trigger}"`)
    } catch (err: any) {
      toast.error(err.message || 'Error sending test alert')
    }
  }

  if (loading) return <p className="p-4 text-center">Loading auto messages...</p>
  if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>

  return (
    <ErrorBoundary fallback={<p className="p-4 text-center text-red-600">Something went wrong.</p>}>
      <Card>
        <CardHeader>
          <CardTitle>Auto Messages</CardTitle>
          <CardDescription>Manage automated messages and triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trigger</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Slack</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autoMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>{msg.trigger}</TableCell>
                  <TableCell>{msg.message}</TableCell>
                  <TableCell>
                    <Badge variant={msg.active ? "secondary" : "outline"}>
                      {msg.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={msg.slackEnabled}
                      disabled={updatingId === msg.id}
                      onCheckedChange={(checked) => toggleChannel(msg.id, 'slack', checked)}
                      aria-label={`Toggle Slack alert for ${msg.trigger}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={msg.whatsappEnabled}
                      disabled={updatingId === msg.id}
                      onCheckedChange={(checked) => toggleChannel(msg.id, 'whatsapp', checked)}
                      aria-label={`Toggle WhatsApp alert for ${msg.trigger}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={msg.emailEnabled}
                      disabled={updatingId === msg.id}
                      onCheckedChange={(checked) => toggleChannel(msg.id, 'email', checked)}
                      aria-label={`Toggle Email alert for ${msg.trigger}`}
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => alert(`Viewing campaign for ${msg.trigger}`)}>
                      View Campaign
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => alert(`Pausing ad for ${msg.trigger}`)}>
                      Pause Ad
                    </Button>
                    <Button size="sm" onClick={() => handleTestAlert(msg.id, 'slack')}>
                      Test Slack
                    </Button>
                    <Button size="sm" onClick={() => handleTestAlert(msg.id, 'whatsapp')}>
                      Test WhatsApp
                    </Button>
                    <Button size="sm" onClick={() => handleTestAlert(msg.id, 'email')}>
                      Test Email
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
