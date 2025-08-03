"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

// Enhanced mock cash log data with profit calculation and ROI
const initialCashLogs = [
  { id: 1, date: "2024-06-01", description: "Ad spend", amount: -500, category: "Marketing" },
  { id: 2, date: "2024-06-03", description: "Product sales", amount: 1500, category: "Revenue" },
  { id: 3, date: "2024-06-05", description: "Consulting fees", amount: 800, category: "Revenue" },
  { id: 4, date: "2024-06-07", description: "Office supplies", amount: -200, category: "Expenses" },
]

export function EnhancedCashLog() {
  const [cashLogs, setCashLogs] = useState(initialCashLogs)

  const totalIncome = cashLogs.filter(log => log.amount > 0).reduce((sum, log) => sum + log.amount, 0)
  const totalExpenses = cashLogs.filter(log => log.amount < 0).reduce((sum, log) => sum + Math.abs(log.amount), 0)
  const netProfit = totalIncome - totalExpenses
  const roi = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100).toFixed(2) : "N/A"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cash Log</CardTitle>
          <CardDescription>Track your cash flow, profit, and ROI</CardDescription>
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
          <div className="mt-4 space-y-1">
            <p><strong>Total Income:</strong> ${totalIncome}</p>
            <p><strong>Total Expenses:</strong> ${totalExpenses}</p>
            <p><strong>Net Profit:</strong> ${netProfit}</p>
            <p><strong>ROI:</strong> {roi === "N/A" ? roi : `${roi}%`}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
