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
  count = 50,
  onParticlesCreated 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create particles when the component becomes active
  useEffect(() => {
    if (active && containerRef.current) {
      const currentContainerRef = containerRef.current;
      const particles = createParticles(currentContainerRef, count);
      if (onParticlesCreated) {
        onParticlesCreated(particles);
      }

      // Clean up function
      return () => {
        if (currentContainerRef) {
          currentContainerRef.innerHTML = '';
        }
      };
    }
  }, [active, count, onParticlesCreated]); // Added onParticlesCreated to dependencies
  
  // Function to create particle elements
  const createParticles = (container: HTMLElement, count: number): HTMLDivElement[] => {
    // Clear existing particles
    container.innerHTML = '';
    
    const particleElements: HTMLDivElement[] = [];
    
    // Create new particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-0';
      
      // Randomize particle properties
      const size = Math.random() * 8 + 2; // 2-10px
      const color = [
        '#d4af37', // Gold (brass)
        '#b87333', // Copper
        '#71797E', // Silver/Lead
        '#555555', // Dark gray (antimony)
        '#8f8f8f', // Light gray (barium)
      ][Math.floor(Math.random() * 5)];
      
      // Set particle style
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = '50%';
      particle.style.top = '50%';
      
      // Add to container
      container.appendChild(particle);
      particleElements.push(particle);
    }
    
    return particleElements;
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticleSystem;