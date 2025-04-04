"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, addHours } from "date-fns"
import { Clock, Calendar } from "lucide-react"

interface AIScheduleSuggestionsProps {
  onSelect: (startTime: Date) => void
}

export function AIScheduleSuggestions({ onSelect }: AIScheduleSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to the AI scheduling service
    const fetchSuggestions = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Generate 3 suggestions
        const now = new Date()
        const suggestion1 = new Date(now)
        suggestion1.setHours(9, 0, 0, 0) // 9 AM
        if (suggestion1 < now) {
          suggestion1.setDate(suggestion1.getDate() + 1)
        }

        const suggestion2 = new Date(now)
        suggestion2.setHours(14, 0, 0, 0) // 2 PM
        if (suggestion2 < now) {
          suggestion2.setDate(suggestion2.getDate() + 1)
        }

        const suggestion3 = new Date(now)
        suggestion3.setHours(10, 0, 0, 0) // 10 AM tomorrow
        suggestion3.setDate(suggestion3.getDate() + 1)

        setSuggestions([suggestion1, suggestion2, suggestion3])
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">AI Suggested Times</h3>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((time, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => onSelect(time)}
              >
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    {index === 0 ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <Calendar className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{format(time, "EEEE, MMMM d")}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(time, "h:mm a")} - {format(addHours(time, 1), "h:mm a")}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-3">
          Based on your calendar availability and productivity patterns
        </p>
      </CardContent>
    </Card>
  )
}

