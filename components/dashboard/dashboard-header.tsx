"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardHeaderProps {
  activeTab?: "today" | "timeline" | "team"
  setActiveTab?: (tab: "today" | "timeline" | "team") => void
}

export function DashboardHeader({ activeTab, setActiveTab }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-10 bg-primary py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">ChronoMind</h1>
        </div>

        <div className="flex items-center gap-4">
          {isMobile && setActiveTab && (
            <div className="flex rounded-md overflow-hidden">
              <Button
                variant={activeTab === "today" ? "default" : "outline"}
                className={activeTab === "today" ? "bg-white text-primary" : "bg-transparent text-white border-white"}
                onClick={() => setActiveTab("today")}
              >
                Today
              </Button>
              <Button
                variant={activeTab === "timeline" ? "default" : "outline"}
                className={
                  activeTab === "timeline" ? "bg-white text-primary" : "bg-transparent text-white border-white"
                }
                onClick={() => setActiveTab("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={activeTab === "team" ? "default" : "outline"}
                className={activeTab === "team" ? "bg-white text-primary" : "bg-transparent text-white border-white"}
                onClick={() => setActiveTab("team")}
              >
                Team
              </Button>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-transparent border-white text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

