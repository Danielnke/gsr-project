"use client";

import React, { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  active: boolean;
  count?: number;
  onParticlesCreated?: (particles: HTMLDivElement[]) => void;
}

/**
 * Component that creates and manages GSR particles
 */
const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  active, 
  count = 75, // Increased to show more particles for chemical transformation
  onParticlesCreated 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create particles when the component becomes active
  useEffect(() => {
    const currentContainer = containerRef.current; // Capture at the top

    if (active && currentContainer) {
      console.log("ParticleSystem: Becoming active, creating particles");
      const particles = createParticles(currentContainer, count); // Use captured
      if (onParticlesCreated) {
        onParticlesCreated(particles);
      }

      return () => {
        if (currentContainer) { // Use captured value
          currentContainer.innerHTML = '';
        }
      };
    }
    // If the condition (active && currentContainer) is false,
    // this effect doesn't return a cleanup function, which is acceptable.
  }, [active, count, onParticlesCreated]);
  
  // Function to create particle elements
  const createParticles = (container: HTMLElement, count: number): HTMLDivElement[] => {
    // Clear existing particles
    container.innerHTML = '';
    console.log("ParticleSystem: Cleared existing particles");
    
    const particleElements: HTMLDivElement[] = [];
    
    // Create new particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-0';
      
      // Randomize particle properties
      const size = Math.random() * 8 + 2; // 2-10px
      // Expanded color array to represent various chemical elements in GSR
      const color = [
        '#d4af37', // Gold (brass)
        '#b87333', // Copper
        '#71797E', // Silver/Lead
        '#555555', // Dark gray (antimony)
        '#8f8f8f', // Light gray (barium)
        '#ff6347', // Tomato (oxidized compounds)
        '#696969', // Dim gray (other metallic residues)
      ][Math.floor(Math.random() * 7)];
      
      // Set particle style
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = '50%';
      particle.style.top = '50%';
      // Temporarily set opacity to 0.5 for debugging to check if particles are created
      particle.style.opacity = '0.5';
      
      // Add to container
      container.appendChild(particle);
      particleElements.push(particle);
    }
    console.log("ParticleSystem: Created particle elements", particleElements);
    return particleElements;
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};

export default ParticleSystem;