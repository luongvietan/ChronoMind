import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, date } = body

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Get user's tasks for the specified date
  const startOfDay = new Date(date || new Date())
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(startOfDay)
  endOfDay.setHours(23, 59, 59, 999)

  // Get user's preferences
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("preferences")
    .eq("id", userId)
    .single()

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  const productiveHours = userData.preferences.productiveHours || { start: 9, end: 17 }

  // Get tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      *,
      tags:task_tags(
        tag:tags(*)
      ),
      dependencies:task_dependencies(
        depends_on_task_id
      )
    `)
    .eq("assigned_to", userId)
    .eq("completed", false)
    .lte("deadline", endOfDay.toISOString())
    .order("priority", { ascending: false })

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 })
  }

  // Get user's analytics to determine task duration patterns
  const { data: analytics, error: analyticsError } = await supabase
    .from("task_analytics")
    .select("*")
    .eq("user_id", userId)

  if (analyticsError) {
    return NextResponse.json({ error: analyticsError.message }, { status: 500 })
  }

  // Get existing calendar events to avoid conflicts
  const { data: calendarEvents, error: calendarError } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", userId)
    .gte("start_time", startOfDay.toISOString())
    .lte("end_time", endOfDay.toISOString())

  if (calendarError) {
    return NextResponse.json({ error: calendarError.message }, { status: 500 })
  }

  // AI Scheduling Algorithm
  const schedule = optimizeSchedule(tasks, analytics, calendarEvents, productiveHours, startOfDay)

  // Save the optimized schedule
  const schedulePromises = schedule.map(async (item) => {
    const { error } = await supabase.from("task_analytics").upsert({
      task_id: item.taskId,
      user_id: userId,
      scheduled_start: item.startTime,
      estimated_duration: item.duration,
    })

    if (error) {
      return { error }
    }

    return { success: true }
  })

  await Promise.all(schedulePromises)

  return NextResponse.json({ schedule })
}

// AI Scheduling Algorithm
function optimizeSchedule(
  tasks: any[],
  analytics: any[],
  calendarEvents: any[],
  productiveHours: { start: number; end: number },
  startOfDay: Date,
) {
  // Convert calendar events to busy time slots
  const busySlots = calendarEvents.map((event) => ({
    start: new Date(event.start_time),
    end: new Date(event.end_time),
  }))

  // Start with an empty schedule
  const schedule: {
    taskId: string
    title: string
    startTime: string
    endTime: string
    duration: number
  }[] = []

  // Sort tasks by priority and deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    // First by priority (higher first)
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }

    // Then by deadline (earlier first)
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })

  // Process dependencies to determine which tasks must be scheduled first
  const dependencyMap = new Map<string, string[]>()

  sortedTasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      dependencyMap.set(
        task.id,
        task.dependencies.map((dep: any) => dep.depends_on_task_id),
      )
    }
  })

  // Topological sort to respect dependencies
  const scheduledTaskIds = new Set<string>()
  const taskQueue: any[] = []

  // Add tasks with no dependencies to the queue
  sortedTasks.forEach((task) => {
    if (!dependencyMap.has(task.id) || dependencyMap.get(task.id)!.length === 0) {
      taskQueue.push(task)
    }
  })

  // Process the queue
  while (taskQueue.length > 0) {
    const task = taskQueue.shift()

    // Estimate task duration based on analytics or default to 30 minutes
    let estimatedDuration = 30 // Default 30 minutes

    // Check if we have analytics for similar tasks
    const taskAnalytics = analytics.filter(
      (a) =>
        a.task_id === task.id ||
        (task.tags && task.tags.some((t: any) => analytics.some((an) => an.task_id === t.tag_id))),
    )

    if (taskAnalytics.length > 0) {
      // Calculate average duration from similar tasks
      estimatedDuration = Math.ceil(
        taskAnalytics.reduce((sum, a) => sum + (a.actual_duration || a.estimated_duration), 0) / taskAnalytics.length,
      )
    }

    // Find the best time slot for this task
    const taskStartTime = findBestTimeSlot(
      estimatedDuration,
      busySlots,
      productiveHours,
      startOfDay,
      task.tags ? task.tags.map((t: any) => t.tag.name) : [],
    )

    if (taskStartTime) {
      const taskEndTime = new Date(taskStartTime)
      taskEndTime.setMinutes(taskEndTime.getMinutes() + estimatedDuration)

      // Add to schedule
      schedule.push({
        taskId: task.id,
        title: task.title,
        startTime: taskStartTime.toISOString(),
        endTime: taskEndTime.toISOString(),
        duration: estimatedDuration,
      })

      // Mark as scheduled
      scheduledTaskIds.add(task.id)

      // Add to busy slots
      busySlots.push({
        start: taskStartTime,
        end: taskEndTime,
      })

      // Add tasks whose dependencies are now satisfied
      sortedTasks.forEach((nextTask) => {
        if (scheduledTaskIds.has(nextTask.id)) return

        const dependencies = dependencyMap.get(nextTask.id)
        if (!dependencies) return

        const allDependenciesMet = dependencies.every((depId) => scheduledTaskIds.has(depId))

        if (allDependenciesMet && !taskQueue.includes(nextTask)) {
          taskQueue.push(nextTask)
        }
      })
    }
  }

  return schedule
}

// Find the best time slot for a task
function findBestTimeSlot(
  durationMinutes: number,
  busySlots: { start: Date; end: Date }[],
  productiveHours: { start: number; end: number },
  startOfDay: Date,
  tags: string[],
) {
  // Sort busy slots by start time
  const sortedBusySlots = [...busySlots].sort((a, b) => a.start.getTime() - b.start.getTime())

  // Define working hours
  const workStart = new Date(startOfDay)
  workStart.setHours(productiveHours.start, 0, 0, 0)

  const workEnd = new Date(startOfDay)
  workEnd.setHours(productiveHours.end, 0, 0, 0)

  // Determine if this is a high-focus task
  const isHighFocus = tags.some((tag) => ["work", "study", "focus", "important"].includes(tag.toLowerCase()))

  // For high-focus tasks, prefer morning hours if the user is a morning person
  let preferredStart = workStart
  if (isHighFocus && productiveHours.start < 12) {
    preferredStart = new Date(workStart)
  } else if (isHighFocus) {
    // For afternoon people, prefer early afternoon
    preferredStart = new Date(workStart)
    preferredStart.setHours(13, 0, 0, 0)
  }

  // Check if preferred time is available
  const preferredEnd = new Date(preferredStart)
  preferredEnd.setMinutes(preferredStart.getMinutes() + durationMinutes)

  const isPreferredTimeAvailable = !sortedBusySlots.some(
    (slot) => slot.start < preferredEnd && preferredStart < slot.end,
  )

  if (isPreferredTimeAvailable && preferredStart >= new Date() && preferredEnd <= workEnd) {
    return preferredStart
  }

  // If preferred time is not available, find the next available slot
  let currentTime = new Date(Math.max(workStart.getTime(), new Date().getTime()))

  while (currentTime < workEnd) {
    const potentialEndTime = new Date(currentTime)
    potentialEndTime.setMinutes(currentTime.getMinutes() + durationMinutes)

    // Check if this slot conflicts with any busy slot
    const hasConflict = sortedBusySlots.some((slot) => slot.start < potentialEndTime && currentTime < slot.end)

    if (!hasConflict && potentialEndTime <= workEnd) {
      return currentTime
    }

    // Move to the end of the conflicting slot
    const conflictingSlot = sortedBusySlots.find((slot) => slot.start <= currentTime && currentTime < slot.end)

    if (conflictingSlot) {
      currentTime = new Date(conflictingSlot.end)
    } else {
      // Move forward by 15 minutes
      currentTime.setMinutes(currentTime.getMinutes() + 15)
    }
  }

  // If no slot found today, return null
  return null
}

