import { CalendarView } from "@/components/calendar/calendar-view"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Calendar</h1>
        <CalendarView />
      </div>
    </ProtectedRoute>
  )
}

