"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useTimeline } from "@/hooks/use-timeline"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const { timelineTasks, isLoading } = useTimeline(date)
  const router = useRouter()

  const handlePrevDay = () => {
    const prevDay = new Date(date)
    prevDay.setDate(prevDay.getDate() - 1)
    setDate(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)
    setDate(nextDay)
  }

  const handleAddTask = () => {
    router.push("/add-task")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
          />
          <Button onClick={handleAddTask} className="w-full mt-4">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Schedule for {format(date, "EEEE, MMMM d, yyyy")}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : timelineTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks scheduled for this day</p>
              <p className="text-sm">Add a task or use AI to optimize your schedule</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timelineTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-md"
                  style={{ backgroundColor: `${task.color}20`, borderLeft: `4px solid ${task.color}` }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(task.startTime), "h:mm a")} - {format(new Date(task.endTime), "h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

