"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Define the structure for a particle's data
export interface Particle {
  id: string;
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  velocityX: number;
  velocityY: number;
  maxDistance: number;
  decay: number;
  element?: HTMLDivElement; // Optional: store the DOM element if needed elsewhere
}

interface ParticleSystemProps {
  active: boolean;
  count?: number;
  onParticlesCreated?: (particles: Particle[]) => void; // Now passes Particle data array
  origin?: { x: number; y: number }; // Optional origin, defaults to center
}

/**
 * Selects a random color from a predefined list suitable for particle effects.
 * @returns A string representing a hex color code.
 */
const getRandomParticleColor = (): string => {
  const colors = [
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FF4500', // OrangeRed
    '#FF6347', // Tomato
    '#FF8C00', // DarkOrange
    '#B22222', // Firebrick
    '#E0E0E0', // Light Grey (metallic hint)
    '#A9A9A9', // Dark Grey (metallic hint)
    '#FFFFFF', // White (flash)
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Creates an array of particle data objects.
 * These objects contain all necessary information to render and animate particles.
 * @param count - The number of particles to create.
 * @param originX - The initial X coordinate for all particles. Defaults to 0.
 * @param originY - The initial Y coordinate for all particles. Defaults to 0.
 * @returns An array of Particle data objects.
 */
const createParticles = (
  count: number,
  originX: number = 0, // Default origin if not specified (e.g. center of a relative container)
  originY: number = 0  // Default origin if not specified
): Particle[] => {
  console.log('ParticleSystem: createParticles called. Count:', count, 'Origin:', originX, originY);
  const particleData: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 5 + 2; // 2-7px
    const velocityX = (Math.random() - 0.5) * 30; // Wider range for X velocity
    const velocityY = (Math.random() - 0.5) * 30 - Math.random() * 15; // Wider range for Y, slight upward bias

    particleData.push({
      id: `particle-${Date.now()}-${i}`,
      color: getRandomParticleColor(),
      size,
      initialX: originX,
      initialY: originY,
      velocityX,
      velocityY,
      maxDistance: Math.random() * 800 + 400, // Increased travel distance (400-1200px)
      decay: 0.95 + Math.random() * 0.04, // Varied decay rate (0.95 - 0.99)
    });
  }
  console.log("ParticleSystem: Created particle data array:", particleData.length, "particles");
  return particleData;
};

/**
 * Animates particles based on the provided data.
 * Creates a dedicated DOM container for particles that allows them to render outside
 * the bounds of their logical parent component. This container is appended to the
 * closest parent <section> of the `animationBoxRef`.
 * Each particle is animated using GSAP for movement and fade-out.
 *
 * @param particlesData - An array of `Particle` data objects to be animated.
 * @param animationBoxRef - A React ref to an HTMLElement that serves as the
 *                          reference for the animation's origin and for finding the
 *                          parent section to attach the particle container.
 * @returns The dynamically created `HTMLDivElement` that contains all particle animations,
 *          or `null` if the `animationBoxRef` is not available or a suitable parent
 *          section cannot be found.
 */
export const animateParticles = (
  particlesData: Particle[],
  animationBoxRef: React.RefObject<HTMLElement | null> // Ref to the box defining animation origin
): HTMLDivElement | null => {
  if (!animationBoxRef.current) {
    console.error("animateParticles: animationBoxRef.current is not available.");
    return null;
  }

  const parentSection = animationBoxRef.current.closest('section');
  if (!parentSection) {
    console.error("animateParticles: Could not find a parent <section> for particle container. Ensure one exists and has position:relative.");
    return null;
  }
   // Ensure parent section has position: relative for absolute positioning of particle container
  if (window.getComputedStyle(parentSection).position === 'static') {
    console.warn("animateParticles: Parent section has static positioning. Setting to relative for particle container.");
    parentSection.style.position = 'relative';
  }


  const particleEffectsContainer = document.createElement('div');
  particleEffectsContainer.id = 'particle-effects-container'; // For potential cleanup/identification
  particleEffectsContainer.style.position = 'absolute';
  particleEffectsContainer.style.top = '0';
  particleEffectsContainer.style.left = '0';
  particleEffectsContainer.style.width = '100%';
  particleEffectsContainer.style.height = '100%';
  particleEffectsContainer.style.overflow = 'visible';
  particleEffectsContainer.style.pointerEvents = 'none';
  particleEffectsContainer.style.zIndex = '100'; // Ensure particles are on top

  parentSection.appendChild(particleEffectsContainer);

  // Calculate origin relative to the animationBoxRef (e.g. center of DischargeAnimation's SVG)
  // For simplicity, assuming particles originate from the center of animationBoxRef
  // This might need adjustment if a more specific origin (like the primer) is needed.
  const originRect = animationBoxRef.current.getBoundingClientRect();
  const parentRect = parentSection.getBoundingClientRect();
  
  const originX = originRect.left - parentRect.left + originRect.width / 2;
  const originY = originRect.top - parentRect.top + originRect.height / 2;


  particlesData.forEach(particle => {
    const particleEl = document.createElement('div');
    particleEl.style.position = 'absolute';
    particleEl.style.left = `${originX}px`; // Start at calculated origin X
    particleEl.style.top = `${originY}px`;  // Start at calculated origin Y
    particleEl.style.width = `${particle.size}px`;
    particleEl.style.height = `${particle.size}px`;
    particleEl.style.backgroundColor = particle.color;
    particleEl.style.borderRadius = '50%';
    // Glow effect for fiery particles
    particleEl.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${particle.color}, 0 0 ${Math.random() * 5 + 2}px rgba(255, 255, 255, 0.7)`;
    particleEl.style.opacity = '1'; // Start fully visible
    
    particleEffectsContainer.appendChild(particleEl);

    // Determine travel distance based on velocity and a multiplier.
    // This factor significantly influences how far particles spread.
    // It's composed of a base value and a random component to add variability.
    const travelDistanceMultiplier = 15 + (Math.random() * 10); // Adjust for desired spread

    gsap.to(particleEl, {
      x: `+=${particle.velocityX * travelDistanceMultiplier}`, // Relative movement
      y: `+=${particle.velocityY * travelDistanceMultiplier}`, // Relative movement
      opacity: 0,
      duration: particle.maxDistance / 200, // Duration based on distance, adjust divisor for speed
      ease: 'power2.out',
      onComplete: () => {
        if (particleEffectsContainer.contains(particleEl)) {
          particleEffectsContainer.removeChild(particleEl);
        }
      }
    });
  });
  console.log("animateParticles: Animation started for", particlesData.length, "particles in new container.");
  return particleEffectsContainer; // Return the container for cleanup
};


/**
 * Component that triggers particle data generation.
 * The actual animation is now handled by `animateParticles` called from the parent.
 */
const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  active, 
  count = 100, // Default particle count, can be overridden
  onParticlesCreated,
  origin = { x: 0, y: 0 } // Default origin if not provided by parent
}) => {
  // This ref is mainly for semantic purposes if we need to attach anything to ParticleSystem itself.
  // The actual particles will be in a separate, dynamically created container.
  const componentRef = useRef<HTMLDivElement>(null); 
  
  useEffect(() => {
    console.log('ParticleSystem: useEffect triggered. active:', active);

    if (active) {
      console.log("ParticleSystem: Becoming active, creating particle data.");
      // For now, createParticles uses a default origin (0,0) or what's passed.
      // If ParticleSystem is always a child of DischargeAnimation and should use its center,
      // DischargeAnimation would need to calculate its center and pass it as 'origin'.
      // For this refactor, we'll assume origin is passed or defaults appropriately for now.
      const particles = createParticles(count, origin.x, origin.y);
      if (onParticlesCreated) {
        console.log("ParticleSystem: Calling onParticlesCreated with particle data:", particles.length);
        onParticlesCreated(particles);
      }
      // No direct DOM manipulation or cleanup here for particles, as that's handled by animateParticles
    }
  }, [active, count, onParticlesCreated, origin]);

  return (
    // This div is mostly a placeholder or for potential future use if ParticleSystem needs its own visual element.
    // It no longer holds the particles themselves.
    <div 
      ref={componentRef} 
      className="absolute inset-0 pointer-events-none z-0" // Reduced z-index as it's not hosting visible particles
      aria-hidden="true"
      data-testid="particle-system-placeholder"
    />
  );
};

export default ParticleSystem;