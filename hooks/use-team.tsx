"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { TeamMember } from "@/lib/types"
import { mockTeamMembers } from "@/lib/mock-data"

export function useTeam(teamId?: string) {
  const { user } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchTeamMembers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Use mock data instead of fetching from database
        setMembers(mockTeamMembers)
      } catch (err) {
        console.error("Error fetching team members:", err)
        setError(err instanceof Error ? err : new Error("An error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
  }, [user, teamId])

  return {
    members,
    isLoading,
    error,
  }
}

