"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleSystem from './ParticleSystem';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface DischargeAnimationProps {
  onPhaseChange: (phase: number) => void;
  className?: string;
}

// Define the ref type
export interface DischargeAnimationRef {
  activate: () => void;
  reset: () => void;
}

/**
 * Component that handles the discharge animation sequence
 */
const DischargeAnimation = forwardRef<DischargeAnimationRef, DischargeAnimationProps>((
  { onPhaseChange, className = '' },
  ref
) => {
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const firingPinRef = useRef<SVGPathElement>(null);
  const primerRef = useRef<SVGCircleElement>(null);
  const flashRef = useRef<SVGPathElement>(null);
  const propellantRef = useRef<SVGRectElement>(null);
  const particlesRef = useRef<HTMLDivElement[] | null>(null);
  
  // State to track animation
  const [isActive, setIsActive] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  
  // Handle particles creation
  const handleParticlesCreated = (newParticles: HTMLDivElement[]) => {
    particlesRef.current = newParticles;
    setParticlesReady(true);
  };
  
  // Main animation sequence
  useEffect(() => {
    // Only proceed if active, elements exist, and particles are ready
    if (!isActive || !particlesReady || !firingPinRef.current || !primerRef.current || 
        !flashRef.current || !propellantRef.current) {
      return;
    }
    
    // Get particles from ref
    const particles = particlesRef.current;
    if (!particles) return;
    
    // Store the phase change function to avoid closure issues
    const phaseChangeFn = onPhaseChange;
    
    // Create the main timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(4); // Final phase
      }
    });
    
    // 1. Firing pin strikes primer
    tl.to(firingPinRef.current, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: 'power4.in',
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(1);
      }
    })
    
    // 2. Primer deforms and flash appears
    .to(primerRef.current, {
      fill: '#ff6600',
      scale: 1.1,
      duration: 0.1,
      ease: 'power2.out'
    }, '-=0.05')
    
    // 3. Flash appears
    .to(flashRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(2);
      }
    }, '-=0.05')
    
    // 4. Propellant ignites
    .to(propellantRef.current, {
      fill: '#ff3300',
      duration: 0.3,
      ease: 'power1.in'
    }, '-=0.1')
    
    // 5. Particles start forming and dispersing
    .to(particles, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      stagger: 0.01,
      ease: 'power1.out',
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(3);
      }
    })
    
    // 6. Particles disperse
    .to(particles, {
      x: () => (Math.random() - 0.5) * 300,
      y: () => (Math.random() - 0.5) * 300,
      opacity: () => Math.random() * 0.7 + 0.3,
      scale: () => Math.random() * 1.5 + 0.5,
      duration: 1,
      ease: 'power2.out'
    }, '-=0.1')
    
    // 7. Some particles fade out (simulating cooling/settling)
    .to(particles, {
      opacity: (i) => i % 3 === 0 ? 0 : Math.random() * 0.7 + 0.3,
      duration: 0.5,
      stagger: 0.01,
      ease: 'power1.in'
    }, '+=0.5');
    
    // Play the animation
    tl.play();
    
    // Clean up
    return () => {
      tl.kill();
    };
  }, [isActive, particlesReady]); // Only depend on boolean flags, not objects or functions
  
  // Activate the animation
  const activate = () => {
    setIsActive(true);
    if (onPhaseChange) onPhaseChange(0); // Initial phase
  };
  
  // Reset the animation
  const reset = () => {
    setIsActive(false);
    setParticlesReady(false); // Reset particles ready state
    particlesRef.current = null; // Clear particles ref
    if (onPhaseChange) onPhaseChange(0);
  };
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    activate,
    reset
  }));

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full aspect-square bg-black/10 rounded-xl overflow-hidden ${className}`}
    >
      {/* SVG Animation Elements */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full"
        aria-labelledby="discharge-animation-title"
        role="img"
      >
        <title id="discharge-animation-title">Firearm Discharge Animation</title>
        
        {/* Cartridge Case (simplified) */}
        <rect 
          x="150" 
          y="200" 
          width="100" 
          height="150" 
          fill="#d4af37" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Primer */}
        <circle 
          ref={primerRef}
          cx="200" 
          cy="325" 
          r="25" 
          fill="#777" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Propellant */}
        <rect 
          ref={propellantRef}
          x="160" 
          y="210" 
          width="80" 
          height="100" 
          fill="#333"
        />
        
        {/* Firing Pin */}
        <path 
          ref={firingPinRef}
          d="M200,380 L210,360 L190,360 Z" 
          fill="#555" 
          stroke="#000" 
          strokeWidth="2"
          transform="translate(-20, -20)"
        />
        
        {/* Flash (initially invisible) */}
        <path 
          ref={flashRef}
          d="M180,300 L220,300 L230,280 L210,290 L200,270 L190,290 L170,280 L180,300 Z" 
          fill="#ff9900" 
          opacity="0"
        />
      </svg>
      
      {/* Particle System */}
      <ParticleSystem 
        active={isActive} 
        count={50} 
        onParticlesCreated={handleParticlesCreated} 
      />
    </div>
  );
});

export default DischargeAnimation;