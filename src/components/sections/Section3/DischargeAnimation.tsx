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

  // Refs for logging
  const firingPinRefForLogging = useRef(firingPinRef);
  const primerRefForLogging = useRef(primerRef);
  const flashRefForLogging = useRef(flashRef);
  const propellantRefForLogging = useRef(propellantRef);
  const particlesRefForLogging = useRef(particlesRef);
  
  // State to track animation
  const [isActive, setIsActive] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  
  // Handle particles creation
  const handleParticlesCreated = (newParticles: HTMLDivElement[]) => {
    console.log("DischargeAnimation: handleParticlesCreated called. newParticles:", newParticles);
    particlesRef.current = newParticles;
    setParticlesReady(true);
    console.log("DischargeAnimation: handleParticlesCreated - particlesReady set to true"); // Enhanced log
  };
  
  // Main animation sequence
  useEffect(() => {
    console.log("DischargeAnimation: Main animation useEffect triggered.");
    console.log("DischargeAnimation useEffect: isActive", isActive);
    console.log("DischargeAnimation useEffect: particlesReady", particlesReady);
    console.log("DischargeAnimation useEffect: firingPinRef", firingPinRefForLogging.current.current);
    console.log("DischargeAnimation useEffect: primerRef", primerRefForLogging.current.current);
    console.log("DischargeAnimation useEffect: flashRef", flashRefForLogging.current.current);
    console.log("DischargeAnimation useEffect: propellantRef", propellantRefForLogging.current.current);
    console.log("DischargeAnimation useEffect: particlesRef", particlesRefForLogging.current.current);

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
        console.log('DischargeAnimation GSAP: Timeline completed');
        if (phaseChangeFn) phaseChangeFn(4); // Final phase
      }
    });
    
    // 1. Firing pin strikes primer
    tl.to(firingPinRef.current, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: 'power4.in',
      onStart: () => console.log('DischargeAnimation GSAP: Firing pin animation started'),
      onComplete: () => {
        console.log('DischargeAnimation GSAP: Firing pin animation completed');
        if (phaseChangeFn) phaseChangeFn(1);
      }
    })
    
    // 2. Primer deforms and flash appears
    .to(primerRef.current, {
      fill: '#ff6600',
      scale: 1.1,
      duration: 0.1,
      ease: 'power2.out',
      onStart: () => console.log('DischargeAnimation GSAP: Primer animation started'),
      onComplete: () => console.log('DischargeAnimation GSAP: Primer animation completed'),
    }, '-=0.05')
    
    // 3. Flash appears
    .to(flashRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      ease: 'power2.out',
      onStart: () => console.log('DischargeAnimation GSAP: Flash animation started'),
      onComplete: () => {
        console.log('DischargeAnimation GSAP: Flash animation completed');
        if (phaseChangeFn) phaseChangeFn(2);
      }
    }, '-=0.05')
    
    // 4. Propellant ignites
    .to(propellantRef.current, {
      fill: '#ff3300',
      duration: 0.3,
      ease: 'power1.in',
      onStart: () => console.log('DischargeAnimation GSAP: Propellant animation started'),
      onComplete: () => console.log('DischargeAnimation GSAP: Propellant animation completed'),
    }, '-=0.1')
    
    // 5. Particles start forming and dispersing
    .to(particles, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      stagger: 0.01,
      ease: 'power1.out',
      onStart: () => {
        console.log('DischargeAnimation GSAP: Particles initial animation started', particles.length, "particles should become visible.");
      },
      onComplete: () => {
        console.log("DischargeAnimation GSAP: Particle initial animation complete, moving to dispersion phase.");
        if (phaseChangeFn) phaseChangeFn(3);
      }
    })
    
    // 6. Particles disperse with initial transformation (sparkling effect)
    .to(particles, {
      x: () => (Math.random() - 0.5) * 400, // Increased range for more dramatic dispersion
      y: () => (Math.random() - 0.5) * 400, // Increased range for more dramatic dispersion
      opacity: () => Math.random() * 0.6 + 0.4, // Higher minimum opacity for visibility
      scale: () => Math.random() * 2 + 0.8, // Larger scale variation for sparkling effect
      rotation: () => Math.random() * 360, // Add rotation for dynamic effect
      duration: 0.8, // Slightly shorter duration for quicker movement
      ease: 'power3.out',
      onStart: () => {
        console.log('DischargeAnimation GSAP: Dispersion animation started for', particles.length, "particles.");
      },
      onComplete: () => console.log('DischargeAnimation GSAP: Dispersion animation completed'),
    }, '-=0.1')
    
    // 7. Simulate chemical transformation with color change (heat effect)
    .to(particles, {
      backgroundColor: (i) => i % 2 === 0 ? '#ff6347' : '#ff3300', // Simulate heat/oxidation
      duration: 0.3,
      stagger: 0.01,
      ease: 'power1.in',
      onStart: () => {
        console.log('DischargeAnimation GSAP: Color transformation animation started for chemical heat effect.');
      },
      onComplete: () => console.log('DischargeAnimation GSAP: Color transformation animation completed'),
    }, '+=0.2')
    
    // 8. Some particles fade out (simulating cooling/settling)
    .to(particles, {
      opacity: (i) => i % 3 === 0 ? 0 : Math.random() * 0.7 + 0.3,
      duration: 0.5,
      stagger: 0.01,
      ease: 'power1.in',
      onStart: () => {
        console.log('DischargeAnimation GSAP: Cooling/settling animation started, some particles fading out.');
      },
      onComplete: () => console.log('DischargeAnimation GSAP: Cooling/settling animation completed'),
    }, '+=0.5');
    
    // Play the animation
    console.log("DischargeAnimation: GSAP timeline about to play. Animating particles:", particles); // Enhanced log
    console.log('DischargeAnimation GSAP: Playing timeline');
    tl.play();
    
    // Clean up
    return () => {
      console.log('DischargeAnimation useEffect: GSAP timeline cleanup');
      tl.kill();
    };
  }, [isActive, particlesReady, onPhaseChange]); // Include onPhaseChange in dependencies
  
  // Activate the animation
  const activate = () => {
    console.log("DischargeAnimation: activate() called");
    setIsActive(true);
    if (onPhaseChange) onPhaseChange(0); // Initial phase
  };
  
  // Reset the animation
  const reset = () => {
    console.log("DischargeAnimation: reset() called");
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
        
        {/* Add gradients for realism */}
        <defs>
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#b87333', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="primerGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: '#777', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#555', stopOpacity: 1 }} />
          </radialGradient>
          <linearGradient id="propellantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#333', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ff3300', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Cartridge Case with gradient */}
        <rect 
          x="150" 
          y="200" 
          width="100" 
          height="150" 
          fill="url(#brassGradient)" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Primer with gradient */}
        <circle 
          ref={primerRef}
          cx="200" 
          cy="325" 
          r="25" 
          fill="url(#primerGradient)" 
          stroke="#000" 
          strokeWidth="2"
        />
        
        {/* Propellant with gradient effect */}
        <rect 
          ref={propellantRef}
          x="160" 
          y="210" 
          width="80" 
          height="100" 
          fill="url(#propellantGradient)"
        />
        
        {/* Firing Pin with more detailed shape */}
        <path 
          ref={firingPinRef}
          d="M200,380 L210,360 L205,355 L195,355 L190,360 Z" 
          fill="#555" 
          stroke="#000" 
          strokeWidth="2"
          transform="translate(-20, -20)"
        />
        
        {/* Flash with glow effect */}
        <path 
          ref={flashRef}
          d="M180,300 L220,300 L230,280 L210,290 L200,270 L190,290 L170,280 L180,300 Z" 
          fill="#ff9900" 
          opacity="0"
          filter="url(#glow)"
        />
        
        {/* Add a simple glow filter for flash */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        
        {/* Add subtle smoke effect (initially invisible) */}
        <g opacity="0">
          <circle cx="200" cy="250" r="10" fill="#888" opacity="0.5" />
          <circle cx="210" cy="240" r="8" fill="#888" opacity="0.3" />
          <circle cx="190" cy="260" r="12" fill="#888" opacity="0.4" />
        </g>
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

// Add display name
DischargeAnimation.displayName = 'DischargeAnimation';