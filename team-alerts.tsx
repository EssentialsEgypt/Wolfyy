"use client"

import { useState, useEffect } from "react"
import supabase from "@/utils/supabaseClient"

type Alert = {
  id: string
  message: string
  type: string
  platform: string
  status: string
  created_at: string
}

export default function TeamAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")

  useEffect(() => {
    fetchAlerts()
  }, [filterStatus, filterType])

  async function fetchAlerts() {
    let query = supabase.from("alerts").select("*").order("created_at", { ascending: false })

    if (filterStatus) {
      query = query.eq("status", filterStatus)
    }
    if (filterType) {
      query = query.eq("type", filterType)
    }

    const { data, error } = await query
    if (!error && data) {
      setAlerts(data)
    }
  }

  async function markResolved(id: string) {
    const { error } = await supabase.from("alerts").update({ status: "resolved" }).eq("id", id)
    if (!error) {
      fetchAlerts()
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Alerts</h1>

      <div className="mb-4 flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="sent">Sent</option>
          <option value="resolved">Resolved</option>
        </select>

        <input
          type="text"
          placeholder="Filter by type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Message</th>
            <th className="border border-gray-300 p-2 text-left">Type</th>
            <th className="border border-gray-300 p-2 text-left">Platform</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Created At</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center">
                No alerts found.
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert.id}>
                <td className="border border-gray-300 p-2">{alert.message}</td>
                <td className="border border-gray-300 p-2">{alert.type}</td>
                <td className="border border-gray-300 p-2">{alert.platform}</td>
                <td className="border border-gray-300 p-2">{alert.status}</td>
                <td className="border border-gray-300 p-2">{new Date(alert.created_at).toLocaleString()}</td>
                <td className="border border-gray-300 p-2">
                  {alert.status !== "resolved" && (
                    <button
                      onClick={() => markResolved(alert.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
