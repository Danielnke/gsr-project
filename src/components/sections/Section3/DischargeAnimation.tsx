"use client";

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleSystem, { Particle, animateParticles } from './ParticleSystem'; // Import Particle type and animateParticles

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ANIMATION_PHASES = {
  IDLE: 0,
  HEAT_BUILDUP: 1,
  DISCHARGE: 2,
  PARTICLE_DISPERSION: 3, // This might need to be adjusted based on ParticleSystem changes
  COMPLETE: 4
};

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
 * Creates and returns a GSAP timeline for the heat buildup animation phase.
 * This includes a pulsating glow on the primer and a vibration effect on the container.
 * @param containerRef - Ref to the main animation container for vibration.
 * @param primerRef - Ref to the primer SVG element for glow effects.
 * @param onComplete - Callback function to execute when the heat buildup animation completes.
 * @returns A GSAP timeline instance for the heat buildup animation.
 */
const animateHeatBuildup = (
  containerRef: React.RefObject<HTMLDivElement | null>, 
  primerRef: React.RefObject<SVGCircleElement | null>, 
  onComplete: () => void
) => {
  const tl = gsap.timeline({ onComplete });

  // Guard against null refs, though an upstream check in useEffect should prevent this.
  if (!containerRef.current || !primerRef.current) {
    console.warn("animateHeatBuildup: Refs not available, skipping animation.");
    // Call onComplete immediately if refs are null, as the animation "effectively" completes.
    // Consider if this is the desired behavior or if an error should be thrown/logged differently.
    if (onComplete) onComplete();
    return tl; // Return an empty timeline or handle as appropriate
  }

  // Pulsating Glow
  tl.to(primerRef.current, {
    filter: 'brightness(1.5) drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))',
      // fill is used instead of backgroundColor for SVG elements
      fill: '#ff9500', 
      duration: 0.3,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut'
    })
    // Intensify Glow
    .to(primerRef.current, {
      filter: 'brightness(2) drop-shadow(0 0 15px rgba(255, 255, 0, 0.9))',
      fill: '#ffff00', // fill instead of backgroundColor
      duration: 0.4,
      ease: 'power2.in'
    }, ">") // Start after the pulsating glow completes
    // Vibration
    .to(containerRef.current, {
      x: '+=1',
      y: '-=1',
      duration: 0.05,
      repeat: 7, // 4 pulses, so 8 movements (to and fro)
      yoyo: true,
      ease: 'power1.inOut'
    }, "<"); // Start concurrently with the intensify glow
  // Removed extra closing brace here
  return tl;
};

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
  const particleDataRef = useRef<Particle[] | null>(null); // Changed to store Particle data
  const widespreadParticleEffectsContainerRef = useRef<HTMLDivElement | null>(null); // For the widespread particle container

  // State to track animation
  const [isActive, setIsActive] = useState(false);
  const [particleDataReady, setParticleDataReady] = useState(false); // Renamed for clarity
  
  // Handle particles data creation
  const handleParticlesCreated = (newParticleData: Particle[]) => {
    particleDataRef.current = newParticleData;
    setParticleDataReady(true);
  };
  
  // Main animation sequence
  useEffect(() => {
    // Only proceed if active, elements exist, and particle data is ready
    if (!isActive || !particleDataReady || !firingPinRef.current || !primerRef.current ||
        !flashRef.current || !propellantRef.current || !containerRef.current ) { // Added containerRef check for animateParticles
      return;
    }
    
    const currentParticleData = particleDataRef.current;
    if (!currentParticleData) return;
    
    // Store the phase change function to avoid closure issues
    const phaseChangeFn = onPhaseChange;
    
    // Create the main timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(ANIMATION_PHASES.COMPLETE); 
      }
    });

    // Phase 1: Heat Buildup
    tl.add(animateHeatBuildup(containerRef, primerRef, () => {
      if (phaseChangeFn) phaseChangeFn(ANIMATION_PHASES.HEAT_BUILDUP);
    }));
    
    // Phase 2: Discharge Sequence (Firing Pin, Primer, Flash, Propellant)
    // 2.1. Firing pin strikes primer
    tl.to(firingPinRef.current, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: 'power4.in',
      onComplete: () => {
        // This is now part of the DISCHARGE phase
      }
    })
    
    // 2. Primer deforms and flash appears
    .to(primerRef.current, {
      fill: '#ff6600', // Reset fill after heat buildup
      filter: 'none', // Reset filter after heat buildup
      scale: 1.1,
      duration: 0.1,
      ease: 'power2.out',
    }, '-=0.05')
    
    // 3. Flash appears
    .to(flashRef.current, {
      opacity: 1,
      scale: 1.5,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(ANIMATION_PHASES.DISCHARGE);
      }
    }, '-=0.05')
    
    // 4. Propellant ignites
    .to(propellantRef.current, {
      fill: '#ff3300',
      duration: 0.3,
      ease: 'power1.in',
    }, '-=0.1')

    // Phase 3: Particle Dispersion
    // 2.5. Trigger widespread particle animation using the new system
    .call(() => {
      if (currentParticleData && containerRef.current) {
        // Clean up any previous particle container first
        if (widespreadParticleEffectsContainerRef.current && widespreadParticleEffectsContainerRef.current.parentNode) {
          widespreadParticleEffectsContainerRef.current.parentNode.removeChild(widespreadParticleEffectsContainerRef.current);
        }
        widespreadParticleEffectsContainerRef.current = animateParticles(currentParticleData, containerRef);
        if (phaseChangeFn) phaseChangeFn(ANIMATION_PHASES.PARTICLE_DISPERSION);
      } else {
        console.warn("DischargeAnimation GSAP: Particle data or containerRef not available for animateParticles.");
      }
    }, [], ">-0.1"); // Changed null to [] for params, Adjust timing relative to propellant ignition if needed
    
    // Play the animation
    tl.play();
    
    // Clean up
    return () => {
      tl.kill();
      // Cleanup widespread particle container on unmount or effect re-run
      if (widespreadParticleEffectsContainerRef.current && widespreadParticleEffectsContainerRef.current.parentNode) {
        widespreadParticleEffectsContainerRef.current.parentNode.removeChild(widespreadParticleEffectsContainerRef.current);
        widespreadParticleEffectsContainerRef.current = null;
      }
    };
  }, [isActive, particleDataReady, onPhaseChange]); // Dependencies updated
  
  // Activate the animation
  const activate = () => {
    setIsActive(true);
    if (onPhaseChange) onPhaseChange(ANIMATION_PHASES.IDLE); 
  };
  
  // Reset the animation
  const reset = () => {
    setIsActive(false);
    setParticleDataReady(false); // Reset particle data ready state
    particleDataRef.current = null; // Clear particle data
    
    // Clean up widespread particle container
    if (widespreadParticleEffectsContainerRef.current && widespreadParticleEffectsContainerRef.current.parentNode) {
      widespreadParticleEffectsContainerRef.current.parentNode.removeChild(widespreadParticleEffectsContainerRef.current);
      widespreadParticleEffectsContainerRef.current = null;
    }

    if (onPhaseChange) onPhaseChange(ANIMATION_PHASES.IDLE);
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
      
      {/* Particle System now only generates data */}
      <ParticleSystem 
        active={isActive} 
        count={150} // Increased count for more dynamic effect
        onParticlesCreated={handleParticlesCreated}
        // origin prop could be passed here if ParticleSystem needs dynamic origin from DischargeAnimation
      />
    </div>
  );
});

export default DischargeAnimation;

// Add display name
DischargeAnimation.displayName = 'DischargeAnimation';