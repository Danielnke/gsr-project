"use client"

import { useEffect, useRef } from "react"

interface CursorEffectProps {
  position: { x: number; y: number }
  velocity: { x: number; y: number }
}

export default function CursorEffect({ position, velocity }: CursorEffectProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const flashlightRef = useRef<HTMLDivElement>(null)
  const cursorSvgRef = useRef<SVGSVGElement>(null)
  const innerGlowRef = useRef<HTMLDivElement>(null)

  // Calculate the magnitude of velocity for shape changes
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)

  useEffect(() => {
    if (!cursorRef.current || !flashlightRef.current || !cursorSvgRef.current || !innerGlowRef.current) return

    // Update cursor position
    cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`

    // Update flashlight intensity based on movement speed
    const glowIntensity = Math.min(0.8 + speed * 0.01, 1)
    flashlightRef.current.style.opacity = glowIntensity.toString()
    innerGlowRef.current.style.opacity = Math.min(glowIntensity + 0.2, 1).toString()

    // Change cursor shape based on velocity
    if (speed > 5) {
      // Calculate angle of movement
      const angle = Math.atan2(velocity.y, velocity.x)

      // Distort the cursor SVG based on movement
      const scaleX = 1 + Math.min(speed * 0.03, 0.4)
      const scaleY = 1 - Math.min(speed * 0.01, 0.2)
      const skewX = Math.min(speed * 0.2, 10) * (velocity.x > 0 ? 1 : -1)

      cursorSvgRef.current.style.transform = `
        rotate(${angle * 0.2}rad) 
        scale(${scaleX}, ${scaleY}) 
        skewX(${skewX}deg)
      `
    } else {
      // Return to normal shape when slow/stopped
      cursorSvgRef.current.style.transform = "rotate(0deg) scale(1, 1) skewX(0deg)"
    }
  }, [position, velocity, speed])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Flashlight outer glow */}
      <div
        ref={flashlightRef}
        className="absolute rounded-full"
        style={{
          width: "400px",
          height: "400px",
          left: "-200px",
          top: "-200px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.05) 70%, transparent 100%)",
          boxShadow: "0 0 60px 30px rgba(255, 255, 255, 0.15)",
          opacity: "0.9",
        }}
      />

      {/* Flashlight inner bright spot */}
      <div
        ref={innerGlowRef}
        className="absolute rounded-full"
        style={{
          width: "200px",
          height: "200px",
          left: "-100px",
          top: "-100px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.2) 60%, transparent 100%)",
          boxShadow: "0 0 30px 15px rgba(255, 255, 255, 0.4)",
          opacity: "1",
        }}
      />

      {/* Cursor SVG */}
      <svg
        ref={cursorSvgRef}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{
          left: "-3px",
          top: "-3px",
          filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))",
          transition: "transform 0.1s ease-out",
          zIndex: 60,
        }}
      >
        <path
          d="M6.148 18.473 8.011 17.47l1.615-.839-2.568-4.816h4.332L.011 .407v16.015l3.316-3.221z"
          fill="#fff"
          transform="translate(10 7)"
        />
        <path
          d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z"
          fill="#000"
          transform="translate(10 7)"
        />
      </svg>
    </div>
  )
}