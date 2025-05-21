"use client";

import React, { useEffect, useRef } from "react";

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
  count = 120, // Increased for more dramatic effect
  onParticlesCreated,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Create particles when the component becomes active
  useEffect(() => {
    const currentContainer = containerRef.current; // Capture at the top

    if (active && currentContainer) {
      const particles = createParticles(currentContainer, count); // Use captured
      if (onParticlesCreated) {
        onParticlesCreated(particles);
      }

      return () => {
        if (currentContainer) {
          // Use captured value
          currentContainer.innerHTML = "";
        }
      };
    }
    // If the condition (active && currentContainer) is false,
    // this effect doesn't return a cleanup function, which is acceptable.
  }, [active, count, onParticlesCreated]);

  // Function to create particle elements
  const createParticles = (
    container: HTMLElement,
    count: number,
  ): HTMLDivElement[] => {
    // Clear existing particles
    container.innerHTML = "";

    const particleElements: HTMLDivElement[] = [];

    // Create new particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full opacity-0";

      // Randomize particle properties with more variation
      const size = Math.random() * 10 + 1; // 1-11px for more size variation

      // Enhanced color array with more red/orange hues for heat effect
      const color = [
        "#d4af37", // Gold (brass)
        "#b87333", // Copper
        "#71797E", // Silver/Lead
        "#555555", // Dark gray (antimony)
        "#8f8f8f", // Light gray (barium)
        "#ff6347", // Tomato (oxidized compounds)
        "#ff4500", // OrangeRed (hot particles)
        "#ff8c00", // DarkOrange (hot particles)
        "#cd5c5c", // IndianRed (hot particles)
        "#dc143c", // Crimson (hot particles)
        "#696969", // Dim gray (other metallic residues)
      ][Math.floor(Math.random() * 11)];

      // Set particle style
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.opacity = "0";
      particle.style.transform = "scale(0.5)";

      // Enhanced glow effect based on color
      const glowSize = Math.floor(size * (Math.random() * 0.5 + 0.5));
      const glowOpacity = Math.random() * 0.4 + 0.6; // 0.6-1.0 for stronger glow

      // Make red/orange particles glow more intensely
      if (color.includes("ff")) {
        particle.style.boxShadow = `0 0 ${glowSize + 2}px ${color}`;
      } else {
        particle.style.boxShadow = `0 0 ${glowSize}px ${color}`;
      }

      // Add sparkle class to some particles
      if (Math.random() > 0.7) {
        particle.classList.add("sparkle-particle");

        // Create a pseudo-element for the sparkle effect
        const style = document.createElement("style");
        const uniqueId = `sparkle-${Math.random().toString(36).substring(2, 9)}`;
        particle.id = uniqueId;

        style.textContent = `
          #${uniqueId}::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            animation: sparkle-pulse 0.8s infinite alternate;
          }
          @keyframes sparkle-pulse {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.8; transform: scale(1.5); }
          }
        `;

        document.head.appendChild(style);
      }

      particle.style.transition = "none"; // Ensure GSAP handles all animations

      // Add to container
      container.appendChild(particle);
      particleElements.push(particle);
    }
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
