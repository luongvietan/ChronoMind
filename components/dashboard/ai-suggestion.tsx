"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Check, X } from "lucide-react"
import { useAISuggestions } from "@/hooks/use-ai-suggestions"

interface AISuggestionProps {
  suggestion: {
    id: string
    type: string
    text: string
  }
}

export function AISuggestion({ suggestion }: AISuggestionProps) {
  const { applySuggestion } = useAISuggestions()

  const handleApply = async () => {
    await applySuggestion(suggestion.id)
  }

  const handleDismiss = async () => {
    await applySuggestion(suggestion.id)
  }

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">{suggestion.text}</p>
            <p className="text-xs text-amber-600 mt-1">Based on your past completion patterns</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-amber-700" onClick={handleDismiss}>
            <X className="h-4 w-4 mr-1" />
            Dismiss
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-8 px-2 bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleApply}
          >
            <Check className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

