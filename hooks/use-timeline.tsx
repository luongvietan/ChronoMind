"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { TimelineTask } from "@/lib/types"
import { mockTimelineData } from "@/lib/mock-data"

export function useTimeline(date?: Date) {
  const { user } = useAuth()
  const [timelineTasks, setTimelineTasks] = useState<TimelineTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastOptimized, setLastOptimized] = useState<Date | null>(null)

  const fetchTimeline = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const selectedDate = date || new Date()

      // Try to get timeline data from localStorage first
      const storedTimeline = localStorage.getItem("chronomind_timeline")
      if (storedTimeline) {
        const parsedTimeline = JSON.parse(storedTimeline)
        setTimelineTasks(parsedTimeline)
        setIsLoading(false)
        return
      }

      // Generate timeline data based on mock data
      const adjustedTasks = mockTimelineData.map((task) => {
        // Adjust dates to the selected date
        const taskDate = new Date(selectedDate)
        const startTime = new Date(task.startTime)
        const endTime = new Date(task.endTime)

        taskDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)
        const newStartTime = new Date(taskDate)

        taskDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0)
        const newEndTime = new Date(taskDate)

        return {
          ...task,
          startTime: newStartTime.toISOString(),
          endTime: newEndTime.toISOString(),
        }
      })

      setTimelineTasks(adjustedTasks)

      // Store in localStorage for future use
      localStorage.setItem("chronomind_timeline", JSON.stringify(adjustedTasks))
    } catch (err) {
      console.error("Error fetching timeline:", err)
      setError(err instanceof Error ? err : new Error("An error occurred"))

      // Use mock data as fallback
      setTimelineTasks(mockTimelineData)
    } finally {
      setIsLoading(false)
    }
  }, [user, date])

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  const refreshTimeline = () => {
    fetchTimeline()
  }

  const optimizeSchedule = async () => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      setIsLoading(true)

      // Simulate optimization process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Get current tasks
      const currentTasks = [...timelineTasks]

      // Simulate optimization by rearranging tasks
      const optimizedTasks = currentTasks.sort((a, b) => {
        // Sort by color (priority) first
        const colorPriority: Record<string, number> = {
          "#FF6B6B": 1, // Red - highest priority
          "#FFB347": 2, // Orange
          "#88D9E6": 3, // Blue
          "#77DD77": 4, // Green - lowest priority
        }

        const aPriority = colorPriority[a.color] || 99
        const bPriority = colorPriority[b.color] || 99

        if (aPriority !== bPriority) {
          return aPriority - bPriority
        }

        // Then by start time
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      })

      // Adjust times to avoid overlaps
      let currentEndTime = new Date(new Date().setHours(9, 0, 0, 0)) // Start at 9 AM

      const finalOptimizedTasks = optimizedTasks.map((task) => {
        const taskDuration = new Date(task.endTime).getTime() - new Date(task.startTime).getTime()

        const newStartTime = new Date(currentEndTime)
        const newEndTime = new Date(newStartTime.getTime() + taskDuration)

        // Update current end time for next task
        currentEndTime = newEndTime

        // Add 15 minute break between tasks
        currentEndTime = new Date(currentEndTime.getTime() + 15 * 60 * 1000)

        return {
          ...task,
          startTime: newStartTime.toISOString(),
          endTime: newEndTime.toISOString(),
        }
      })

      setTimelineTasks(finalOptimizedTasks)
      setLastOptimized(new Date())

      // Store optimized timeline in localStorage
      localStorage.setItem("chronomind_timeline", JSON.stringify(finalOptimizedTasks))

      return { data: { success: true }, error: null }
    } catch (err) {
      console.error("Error optimizing schedule:", err)
      return { error: err instanceof Error ? err : new Error("An error occurred"), data: null }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    timelineTasks,
    isLoading,
    error,
    optimizeSchedule,
    refreshTimeline,
    lastOptimized,
  }
}

