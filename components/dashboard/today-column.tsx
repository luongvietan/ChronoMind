"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TaskCard } from "./task-card"
import { PlusIcon, AlertCircle } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TodayColumn() {
  const today = new Date()
  const { tasks, isLoading, error, addTask, updateTask } = useTasks()
  const [newTaskInput, setNewTaskInput] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [addTaskError, setAddTaskError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddTask = async () => {
    if (!newTaskInput.trim()) return

    setIsAddingTask(true)
    setAddTaskError(null)

    try {
      const newTask: Omit<Task, "id"> = {
        title: newTaskInput,
        priority: 3,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        tags: [],
        completed: false,
      }

      const { error, data } = await addTask(newTask)

      if (error) {
        console.error("Error adding task:", error)
        setAddTaskError(error.message || "Failed to add task")
        toast({
          title: "Error adding task",
          description: error.message || "Failed to add task",
          variant: "destructive",
        })
        return
      }

      setNewTaskInput("")
      toast({
        title: "Task added",
        description: "Your task has been added successfully",
      })
    } catch (err) {
      console.error("Unexpected error adding task:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setAddTaskError(errorMessage)
      toast({
        title: "Error adding task",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAddingTask(false)
    }
  }

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await updateTask(taskId, { completed })

      if (error) {
        toast({
          title: "Error updating task",
          description: error.message || "Failed to update task",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating task:", err)
      toast({
        title: "Error updating task",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
            disabled={isAddingTask}
          />
          <Button onClick={handleAddTask} size="icon" disabled={isAddingTask || !newTaskInput.trim()}>
            {isAddingTask ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {addTaskError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{addTaskError}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Error loading tasks</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks for today</p>
            <p className="text-sm">Add a task to get started</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={(completed) => handleTaskComplete(task.id, completed)} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

