"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EnhancedAIChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hello! How can I assist you with your social media marketing today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return
    const userMessage = { id: Date.now(), sender: "user", text: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: "ai",
        text: "This is a simulated AI response to: " + userMessage.text
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>AI Chat</CardTitle>
        <CardDescription>Chat with the AI assistant for social media marketing help</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 overflow-auto space-y-4 p-4 bg-gray-900 text-white rounded">
        <div className="flex flex-col space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded ${
                msg.sender === "user" ? "self-end bg-blue-600" : "self-start bg-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && <div className="self-start italic text-gray-400">AI is typing...</div>}
        </div>
      </CardContent>
      <div className="flex p-4 border-t border-gray-700">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
          className="flex-1 mr-2"
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>
    </Card>
  )
}
