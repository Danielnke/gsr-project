"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { gsap } from 'gsap';

interface HotspotProps {
  x: number;
  y: number;
  label: string;
  content: React.ReactNode;
  size?: number;
  color?: string;
  pulseColor?: string;
}

const Hotspot: React.FC<HotspotProps> = ({
  x,
  y,
  label,
  content,
  size = 20,
  color = '#000',
  pulseColor = 'rgba(0, 0, 0, 0.3)'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate the position of the hotspot
  const style = {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
  };

  // Handle animation on hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="absolute rounded-full cursor-pointer z-10 flex items-center justify-center"
          style={style}
          aria-label={`Hotspot for ${label}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Pulse animation */}
          <span 
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: pulseColor }}
            aria-hidden="true"
          />
          <span className="sr-only">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-4 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg"
        side="right"
        align="center"
        sideOffset={5}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          <div className="text-sm text-gray-600">{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Hotspot;