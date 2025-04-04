"use client"

import { useState, useEffect } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import { useAuth } from "@/contexts/auth-context"
import type { Task } from "@/lib/types"
import { mockTasks } from "@/lib/mock-data"

export function useTasks(options?: {
  teamId?: string
  completed?: boolean
  date?: Date
}) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  const fetchTasks = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch from Supabase
      const { data: tasksData, error: tasksError } = await supabaseBrowser
        .from("tasks")
        .select("*")
        .eq("assigned_to", user.id)
        .order("deadline", { ascending: true })

      if (tasksError) {
        console.error("Error fetching tasks from Supabase:", tasksError)

        // Check if we have tasks in localStorage
        const storedTasks = localStorage.getItem("chronomind_tasks")
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
          setUseLocalStorage(true)
        } else {
          // Use mock data as fallback
          setTasks(mockTasks)
          // Store mock data in localStorage for future use
          localStorage.setItem("chronomind_tasks", JSON.stringify(mockTasks))
          setUseLocalStorage(true)
        }
        return
      }

      // Transform the data to match our Task type
      const transformedTasks: Task[] = tasksData.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        priority: task.priority,
        deadline: task.deadline || new Date().toISOString(),
        tags: [], // We'll fetch tags separately
        completed: task.completed,
        assignedTo: task.assigned_to,
        dependencies: [],
      }))

      setTasks(transformedTasks)
      setUseLocalStorage(false)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err instanceof Error ? err : new Error("An error occurred"))

      // Use mock data as fallback
      setTasks(mockTasks)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()

    // Set up real-time subscription only if not using localStorage
    if (user && !useLocalStorage) {
      try {
        const subscription = supabaseBrowser
          .channel("tasks-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "tasks",
              filter: `assigned_to=eq.${user.id}`,
            },
            () => {
              fetchTasks()
            },
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error("Error setting up real-time subscription:", err)
      }
    }
  }, [user, options?.teamId, options?.completed, options?.date, useLocalStorage])

  const addTask = async (task: Omit<Task, "id">) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      if (useLocalStorage) {
        // Add task to localStorage
        const newTask: Task = {
          ...task,
          id: `local-${Date.now()}`,
          assignedTo: user.id,
        }

        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))

        return { data: newTask, error: null }
      }

      // Try to add to Supabase
      const { data, error: insertError } = await supabaseBrowser
        .from("tasks")
        .insert([
          {
            title: task.title,
            description: task.description,
            priority: task.priority,
            deadline: task.deadline,
            completed: task.completed,
            created_by: user.id,
            assigned_to: user.id,
            team_id: null,
          },
        ])
        .select()

      if (insertError) {
        console.error("Error inserting task into Supabase:", insertError)

        // Fall back to localStorage
        const newTask: Task = {
          ...task,
          id: `local-${Date.now()}`,
          assignedTo: user.id,
        }

        const updatedTasks = [...tasks, newTask]
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))
        setUseLocalStorage(true)

        return { data: newTask, error: null }
      }

      // Refresh tasks after adding
      fetchTasks()

      return { data: data?.[0], error: null }
    } catch (err) {
      console.error("Error adding task:", err)
      return { error: err instanceof Error ? err : new Error("An error occurred"), data: null }
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      if (useLocalStorage || id.startsWith("local-")) {
        // Update task in localStorage
        const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))

        return { error: null }
      }

      // Try to update in Supabase
      const { error: updateError } = await supabaseBrowser
        .from("tasks")
        .update({
          title: updates.title,
          description: updates.description,
          priority: updates.priority,
          deadline: updates.deadline,
          completed: updates.completed,
          completed_at: updates.completed ? new Date().toISOString() : null,
        })
        .eq("id", id)

      if (updateError) {
        console.error("Error updating task in Supabase:", updateError)

        // Fall back to localStorage
        const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))
        setUseLocalStorage(true)

        return { error: null }
      }

      // Refresh tasks after updating
      fetchTasks()

      return { error: null }
    } catch (err) {
      console.error("Error updating task:", err)
      return { error: err instanceof Error ? err : new Error("An error occurred") }
    }
  }

  const deleteTask = async (id: string) => {
    if (!user) return { error: new Error("User not authenticated") }

    try {
      if (useLocalStorage || id.startsWith("local-")) {
        // Delete task from localStorage
        const updatedTasks = tasks.filter((task) => task.id !== id)
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))

        return { error: null }
      }

      // Try to delete from Supabase
      const { error: deleteError } = await supabaseBrowser.from("tasks").delete().eq("id", id)

      if (deleteError) {
        console.error("Error deleting task from Supabase:", deleteError)

        // Fall back to localStorage
        const updatedTasks = tasks.filter((task) => task.id !== id)
        setTasks(updatedTasks)
        localStorage.setItem("chronomind_tasks", JSON.stringify(updatedTasks))
        setUseLocalStorage(true)

        return { error: null }
      }

      // Refresh tasks after deleting
      fetchTasks()

      return { error: null }
    } catch (err) {
      console.error("Error deleting task:", err)
      return { error: err instanceof Error ? err : new Error("An error occurred") }
    }
  }

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks,
  }
}

