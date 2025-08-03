"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import ErrorBoundary from "@/components/ui/error-boundary"

const enableCashLogUpgrade = true
const isAdmin = true // Replace with real auth role check

interface CashLogEntry {
  id: number
  date: string
  description: string
  amount: number
  category: string
  paid: boolean
  reimbursed: boolean
}

export function CashLog() {
  const [cashLogs, setCashLogs] = useState<CashLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchCashLogs() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/cash-log")
        if (!res.ok) throw new Error("Failed to fetch cash logs")
        const data = await res.json()
        setCashLogs(data.entries)
      } catch (err: any) {
        setError(err.message || "Error loading cash logs")
      } finally {
        setLoading(false)
      }
    }
    fetchCashLogs()
  }, [])

  function validateForm() {
    if (!date || !description || !amount || !category) {
      setFormError("All fields are required")
      return false
    }
    if (isNaN(Number(amount))) {
      setFormError("Amount must be a valid number")
      return false
    }
    setFormError(null)
    return true
  }

  async function handleAddEntry() {
    if (!validateForm()) return
    try {
      setSubmitting(true)
      const res = await fetch("/api/cash-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          description,
          amount: Number(amount),
          category,
        }),
      })
      if (!res.ok) throw new Error("Failed to add cash log entry")
      const data = await res.json()
      setCashLogs((prev) => [...prev, data.entry])
      toast.success("Cash log entry added")
      // Reset form
      setDate("")
      setDescription("")
      setAmount("")
      setCategory("")
    } catch (err: any) {
      toast.error(err.message || "Error adding entry")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMarkAsPaid(id: number) {
    if (!isAdmin) {
      toast.error("Unauthorized action")
      return
    }
    try {
      const res = await fetch(`/api/cash-log/${id}/mark-paid`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Failed to mark as paid")
      setCashLogs((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, paid: true } : entry
        )
      )
      toast.success("Marked as paid")
    } catch (err: any) {
      toast.error(err.message || "Error marking as paid")
    }
  }

  async function handleReimburse(id: number) {
    if (!isAdmin) {
      toast.error("Unauthorized action")
      return
    }
    try {
      const res = await fetch(`/api/cash-log/${id}/reimburse`, {
        method: "PUT",
      })
      if (!res.ok) throw new Error("Failed to reimburse")
      setCashLogs((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, reimbursed: true } : entry
        )
      )
      toast.success("Reimbursed")
    } catch (err: any) {
      toast.error(err.message || "Error reimbursing")
    }
  }

  if (!enableCashLogUpgrade) {
    // Fallback to basic static display
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cash Log</CardTitle>
          <CardDescription>Track your cash flow and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell className={log.amount < 0 ? "text-red-600" : "text-green-600"}>
                    {log.amount < 0 ? `-$${Math.abs(log.amount)}` : `$${log.amount}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.category}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  if (loading) return <p className="p-4 text-center">Loading cash logs...</p>
  if (error) return <p className="p-4 text-center text-red-600">Error: {error}</p>

  return (
    <ErrorBoundary fallback={<p className="p-4 text-center text-red-600">Something went wrong.</p>}>
      <Card>
        <CardHeader>
          <CardTitle>Cash Log</CardTitle>
          <CardDescription>Track your cash flow and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddEntry()
            }}
            className="mb-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Date"
                required
              />
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-label="Description"
                required
              />
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Amount"
                required
              />
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
                aria-label="Category"
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && <p className="text-red-600">{formError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Entry"}
            </Button>
          </form>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                {isAdmin && <TableHead>Paid</TableHead>}
                {isAdmin && <TableHead>Reimbursed</TableHead>}
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cashLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell className={log.amount < 0 ? "text-red-600" : "text-green-600"}>
                    {log.amount < 0 ? `-$${Math.abs(log.amount)}` : `$${log.amount}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.category}</Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>{log.paid ? "Yes" : "No"}</TableCell>
                  )}
                  {isAdmin && (
                    <TableCell>{log.reimbursed ? "Yes" : "No"}</TableCell>
                  )}
                  {isAdmin && (
                    <TableCell className="space-x-2">
                      {!log.paid && (
                        <Button size="sm" onClick={() => handleMarkAsPaid(log.id)}>
                          Mark as Paid
                        </Button>
                      )}
                      {!log.reimbursed && (
                        <Button size="sm" onClick={() => handleReimburse(log.id)}>
                          Reimburse Now
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
