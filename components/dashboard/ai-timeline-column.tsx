"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react"
import { AITimelineChart } from "./ai-timeline-chart"
import { AISuggestion } from "./ai-suggestion"
import { useTimeline } from "@/hooks/use-timeline"
import { useAISuggestions } from "@/hooks/use-ai-suggestions"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AITimelineColumn() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizeError, setOptimizeError] = useState<string | null>(null)
  const { timelineTasks, isLoading, optimizeSchedule, refreshTimeline } = useTimeline()
  const { suggestions, isLoading: suggestionsLoading } = useAISuggestions()
  const { toast } = useToast()

  const handleOptimize = async () => {
    setIsOptimizing(true)
    setOptimizeError(null)

    try {
      const { error, data } = await optimizeSchedule()

      if (error) {
        console.error("Error optimizing schedule:", error)
        setOptimizeError(error.message || "Failed to optimize schedule")
        toast({
          title: "Optimization failed",
          description: error.message || "Failed to optimize schedule",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Schedule optimized",
        description: "Your schedule has been optimized for maximum productivity",
      })
    } catch (err) {
      console.error("Unexpected error optimizing schedule:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setOptimizeError(errorMessage)
      toast({
        title: "Optimization failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleRefresh = () => {
    refreshTimeline()
    toast({
      title: "Timeline refreshed",
      description: "Your timeline has been updated with the latest data",
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">AI Timeline</CardTitle>
        <Button variant="secondary" size="sm" className="gap-1" onClick={handleOptimize} disabled={isOptimizing}>
          {isOptimizing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Optimize Now</span>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {optimizeError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{optimizeError}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <AITimelineChart tasks={timelineTasks} />

            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full gap-1" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Timeline</span>
              </Button>
            </div>

            {!suggestionsLoading && suggestions.length > 0 && (
              <div className="mt-6">
                <AISuggestion suggestion={suggestions[0]} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

