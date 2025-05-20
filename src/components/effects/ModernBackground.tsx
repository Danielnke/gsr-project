"use client";

import React, { useEffect, useState, useRef } from "react";
import BackgroundEffect from "./BackgroundEffect";
import CursorEffect from "./CursorEffect";

const ModernBackground: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      const currentX = event.clientX;
      const currentY = event.clientY;

      const updateEffects = () => {
        setCursorPosition({ x: currentX, y: currentY });

        if (lastPositionRef.current) {
          const velX = currentX - lastPositionRef.current.x;
          const velY = currentY - lastPositionRef.current.y;
          setVelocity({ x: velX, y: velY });
        }
        lastPositionRef.current = { x: currentX, y: currentY };
      };

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      animationFrameIdRef.current = requestAnimationFrame(updateEffects);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-10]">
      <BackgroundEffect cursorPosition={cursorPosition} />
      <CursorEffect position={cursorPosition} velocity={velocity} />
    </div>
  );
};

export default ModernBackground;
