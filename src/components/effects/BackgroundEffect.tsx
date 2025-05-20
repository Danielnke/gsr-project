"use client"

import { useEffect, useRef } from "react"

interface BackgroundEffectProps {
  cursorPosition: { x: number; y: number }
}

export default function BackgroundEffect({ cursorPosition }: BackgroundEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create subtle background pattern
    const drawBackground = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fill with black
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw subtle grid pattern
      ctx.strokeStyle = "rgba(30, 30, 30, 0.3)"
      ctx.lineWidth = 0.5

      const gridSize = 40

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Add subtle glow around cursor position
      const gradient = ctx.createRadialGradient(
        cursorPosition.x,
        cursorPosition.y,
        0,
        cursorPosition.x,
        cursorPosition.y,
        300,
      )

      gradient.addColorStop(0, "rgba(40, 40, 40, 0.4)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      drawBackground()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [cursorPosition])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}