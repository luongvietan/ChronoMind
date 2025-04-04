"use client"

import { useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { TodayColumn } from "./today-column"
import { AITimelineColumn } from "./ai-timeline-column"
import { TeamProgressColumn } from "./team-progress-column"
import { useMobile } from "@/hooks/use-mobile"

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"today" | "timeline" | "team">("today")
  const isMobile = useMobile()

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 container mx-auto py-6 px-4">
        {isMobile ? (
          // Mobile view - show only one column based on active tab
          <div className="w-full">
            {activeTab === "today" && <TodayColumn />}
            {activeTab === "timeline" && <AITimelineColumn />}
            {activeTab === "team" && <TeamProgressColumn />}
          </div>
        ) : (
          // Desktop view - show all columns
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <TodayColumn />
            </div>
            <div className="lg:col-span-2">
              <AITimelineColumn />
            </div>
            <div className="lg:col-span-1">
              <TeamProgressColumn />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

