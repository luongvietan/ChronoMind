"use client"

import { useEffect, useRef } from "react"
import type { TimelineTask } from "@/lib/types"

interface AITimelineChartProps {
  tasks: TimelineTask[]
}

export function AITimelineChart({ tasks }: AITimelineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw timeline
    const hourWidth = canvas.offsetWidth / 12 // 12 hours in the timeline
    const startHour = 8 // 8 AM

    // Draw hour lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    for (let i = 0; i <= 12; i++) {
      const x = i * hourWidth
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.offsetHeight)
      ctx.stroke()

      // Draw hour labels
      if (i < 12) {
        ctx.fillStyle = "#64748b"
        ctx.font = "12px Inter"
        ctx.textAlign = "center"
        ctx.fillText(`${(startHour + i) % 12 || 12}${(startHour + i) < 12 ? "am" : "pm"}`, x + hourWidth / 2, 15)
      }
    }

    // Draw tasks
    tasks.forEach((task, index) => {
      const taskStartHour = new Date(task.startTime).getHours() + new Date(task.startTime).getMinutes() / 60
      const taskEndHour = new Date(task.endTime).getHours() + new Date(task.endTime).getMinutes() / 60

      const taskStartX = (taskStartHour - startHour) * hourWidth
      const taskWidth = (taskEndHour - taskStartHour) * hourWidth

      const taskY = 30 + index * 50
      const taskHeight = 40

      // Task background
      ctx.fillStyle = task.color
      ctx.beginPath()
      ctx.roundRect(taskStartX, taskY, taskWidth, taskHeight, 6)
      ctx.fill()

      // Task text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Inter"
      ctx.textAlign = "left"
      ctx.fillText(task.title, taskStartX + 10, taskY + 24)
    })
  }, [tasks])

  return (
    <div className="relative h-[300px] w-full">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

