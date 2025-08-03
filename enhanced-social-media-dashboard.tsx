"use client"

import { useState } from "react"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart3, Users, Calendar, DollarSign, Target, Eye, Globe, Lightbulb, MessageSquare, Image, Home, TrendingUp, Settings } from "lucide-react"

import { EnhancedDashboardOverview } from "./enhanced-dashboard-overview"
import { RedesignedOverviewDashboard } from "./redesigned-overview-dashboard"
import { EnhancedCompetitorTracking } from "./enhanced-competitor-tracking"
import { EnhancedContentHub } from "./enhanced-content-hub"
import { EnhancedCashLog } from "./enhanced-cash-log"
import { EnhancedAdPerformance } from "./enhanced-ad-performance"
import { EnhancedAudienceTracker } from "./enhanced-audience-tracker"
import { EnhancedWebsiteAnalytics } from "./enhanced-website-analytics"
import { EnhancedAdIdeaGenerator } from "./enhanced-ad-idea-generator"
import { EnhancedAutoMessages } from "./enhanced-auto-messages"
import { EnhancedAIChat } from "./enhanced-ai-chat"
import { AIPoweredCampaignInsights } from "./ai-powered-campaign-insights"
import { BrandingPlaceholder } from "./branding-placeholder"
import { SocialMediaManager } from "./social-media-manager"
import { BrandAssetsHub } from "./brand-assets-hub"

const sidebarItems = [
  { id: "dashboard", label: "Social Media Manager", icon: Home },
  { id: "redesigneddashboard", label: "Redesigned Dashboard", icon: BarChart3 },
  { id: "competitor", label: "Competitor Tracking", icon: TrendingUp },
  { id: "content", label: "Content Hub", icon: Calendar },
  { id: "brandassets", label: "Brand Assets Hub", icon: Image },
  { id: "cash", label: "Cash Log", icon: DollarSign },
  { id: "ads", label: "Ad Performance", icon: Target },
  { id: "audience", label: "Audience Tracker", icon: Users },
  { id: "website", label: "Website Analytics", icon: Globe },
  { id: "campaigninsights", label: "AI Campaign Insights", icon: Lightbulb },
  { id: "ideas", label: "Ad Ideas", icon: Lightbulb },
  { id: "messages", label: "Auto Messages", icon: MessageSquare },
  { id: "aichat", label: "AI Chat", icon: Lightbulb },
  { id: "branding", label: "Branding", icon: Settings },
]

export function EnhancedSocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <SocialMediaManager />
      case "redesigneddashboard":
        return <RedesignedOverviewDashboard />
      case "competitor":
        return <EnhancedCompetitorTracking />
      case "content":
        return <EnhancedContentHub />
      case "brandassets":
        return <BrandAssetsHub />
      case "cash":
        return <EnhancedCashLog />
      case "ads":
        return <EnhancedAdPerformance />
      case "audience":
        return <EnhancedAudienceTracker />
      case "website":
        return <EnhancedWebsiteAnalytics />
      case "campaigninsights":
        return <AIPoweredCampaignInsights />
      case "ideas":
        return <EnhancedAdIdeaGenerator />
      case "messages":
        return <EnhancedAutoMessages />
      case "aichat":
        return <EnhancedAIChat />
      case "branding":
        return <BrandingPlaceholder />
      default:
        return <SocialMediaManager />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">Essentials Egypt Enhanced</span>
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
            <span className="text-sm text-muted-foreground">Enhanced Mode</span>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
