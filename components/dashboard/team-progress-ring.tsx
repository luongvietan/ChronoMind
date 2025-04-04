"use client"

import { useEffect, useRef } from "react"

interface TeamProgressRingProps {
  progress: number
}

export function TeamProgressRing({ progress }: TeamProgressRingProps) {
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

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 10
    ctx.stroke()

    // Draw progress arc
    const startAngle = -0.5 * Math.PI // Start at the top
    const endAngle = startAngle + (progress / 100) * 2 * Math.PI

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = "#88D9E6" // Primary color
    ctx.lineWidth = 10
    ctx.stroke()

    // Draw text
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 24px Inter"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${progress}%`, centerX, centerY)
  }, [progress])

  return <canvas ref={canvasRef} className="w-32 h-32" style={{ width: "128px", height: "128px" }} />
}

