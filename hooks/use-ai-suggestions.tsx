"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function useAISuggestions() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<
    {
      id: string
      type: string
      text: string
      createdAt: string
    }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchSuggestions = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Use mock data instead of fetching from database
        setSuggestions([
          {
            id: "suggestion-1",
            type: "schedule",
            text: "Consider rescheduling your 'Project Proposal' task to tomorrow morning when you're more productive.",
            createdAt: new Date().toISOString(),
          },
        ])
      } catch (err) {
        console.error("Error fetching suggestions:", err)
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [user])

  const applySuggestion = async (id: string) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      // Remove the suggestion from the list
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
      return { error: null }
    } catch (err) {
      console.error("Error applying suggestion:", err)
      return { error: err instanceof Error ? err : new Error("An error occurred") }
    }
  }

  return {
    suggestions,
    isLoading,
    error,
    applySuggestion,
  }
}

