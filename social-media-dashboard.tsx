"use client"

import { useState } from "react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  Target, 
  Eye, 
  Globe, 
  Lightbulb, 
  MessageSquare,
  Image,
  Home,
  TrendingUp,
  Settings
} from "lucide-react"

import { DashboardOverview } from "./dashboard-overview"
import { CompetitorTracking } from "./competitor-tracking"
import { ContentHub } from "./content-hub"
import { CashLog } from "./cash-log"
import { AdPerformance } from "./ad-performance"
import { AudienceTracker } from "./audience-tracker"
import { WebsiteAnalytics } from "./website-analytics"
import { AdIdeaGenerator } from "./ad-idea-generator"
import { AutoMessages } from "./auto-messages"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "competitor", label: "Competitor Tracking", icon: TrendingUp },
  { id: "content", label: "Content Hub", icon: Calendar },
  { id: "cash", label: "Cash Log", icon: DollarSign },
  { id: "ads", label: "Ad Performance", icon: Target },
  { id: "audience", label: "Audience Tracker", icon: Users },
  { id: "website", label: "Website Analytics", icon: Globe },
  { id: "ideas", label: "Ad Ideas", icon: Lightbulb },
  { id: "messages", label: "Auto Messages", icon: MessageSquare },
]

export function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "competitor":
        return <CompetitorTracking />
      case "content":
        return <ContentHub />
      case "cash":
        return <CashLog />
      case "ads":
        return <AdPerformance />
      case "audience":
        return <AudienceTracker />
      case "website":
        return <WebsiteAnalytics />
      case "ideas":
        return <AdIdeaGenerator />
      case "messages":
        return <AutoMessages />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">Essentials Egypt</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">
                {sidebarItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h1>
            </div>
            <Badge variant="secondary">Mock Data Mode</Badge>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
