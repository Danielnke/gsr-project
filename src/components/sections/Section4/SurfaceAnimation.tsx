import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { particleColorsArray } from './ParticleConfig';

interface SurfaceAnimationProps {
  animationPhase: number;
}

const SurfaceAnimation: React.FC<SurfaceAnimationProps> = ({ animationPhase }) => {
  // Refs for different surfaces
  const bottomSurfaceRef = useRef<HTMLDivElement>(null);
  const leftSurfaceRef = useRef<HTMLDivElement>(null);
  const rightSurfaceRef = useRef<HTMLDivElement>(null);
  const handOutlineRef = useRef<HTMLDivElement>(null);
  
  // Animation sequence for the surfaces (where particles land)
  useEffect(() => {
    if (!bottomSurfaceRef.current || !leftSurfaceRef.current || !rightSurfaceRef.current || !handOutlineRef.current) return;
    
    // Create a timeline for surface animations
    const tl = gsap.timeline();
    
    // Initially hide all surfaces
    tl.set([bottomSurfaceRef.current, leftSurfaceRef.current, rightSurfaceRef.current, handOutlineRef.current], { 
      opacity: 0, 
      y: 20 
    });
    
    // Phase 3: Show the surfaces as particles start to settle
    if (animationPhase >= 3) {
      // Fade in the surfaces sequentially
      tl.to(bottomSurfaceRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to([leftSurfaceRef.current, rightSurfaceRef.current], {
        opacity: 0.7,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      }, "-=0.4")
      .to(handOutlineRef.current, {
        opacity: 0.9,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.2");
      
      // Add particle spots to the surfaces
      if (animationPhase >= 4) {
        // Clear any existing spots from all surfaces
        [bottomSurfaceRef.current, leftSurfaceRef.current, rightSurfaceRef.current, handOutlineRef.current].forEach(surface => {
          while (surface.firstChild) {
            surface.removeChild(surface.firstChild);
          }
        });
        
        // Create particle spots on bottom surface (most dense)
        const bottomSpots = createParticleSpots(bottomSurfaceRef.current, 50);
        
        // Create particle spots on side surfaces (less dense)
        const leftSpots = createParticleSpots(leftSurfaceRef.current, 20);
        const rightSpots = createParticleSpots(rightSurfaceRef.current, 20);
        
        // Create particle spots on hand outline (highest concentration)
        const handSpots = createParticleSpots(handOutlineRef.current, 40, true);
        
        // Animate spots appearing with staggered effect
        tl.to([...bottomSpots, ...leftSpots, ...rightSpots, ...handSpots], {
          opacity: 0.8,
          scale: 1,
          duration: 0.5,
          stagger: 0.005, // Faster stagger for more natural appearance
          ease: "power1.out",
        });
      }
    }
    
    return () => {
      tl.kill();
    };
  }, [animationPhase]);
  
  // Helper function to create particle spots on a surface
  const createParticleSpots = (surface: HTMLDivElement, count: number, isHand: boolean = false) => {
    const spots = [];
    
    for (let i = 0; i < count; i++) {
      const spot = document.createElement('div');
      spot.className = 'absolute rounded-full';
      
      // Randomize spot properties
      const size = Math.random() * 3 + 1; // 1-4px
      const color = particleColorsArray[Math.floor(Math.random() * particleColorsArray.length)];
      
      // Position randomly on the surface
      // For hand outline, concentrate particles in specific areas (between thumb and index finger)
      let left, top;
      
      if (isHand) {
        // Concentrate particles in the web between thumb and index finger
        // and around the thumb and index finger
        const areaSelector = Math.random();
        if (areaSelector < 0.7) { // 70% chance - web between thumb and index (higher concentration)
          left = Math.random() * 15 + 25; // 25-40%
          top = Math.random() * 15 + 40; // 40-55%
        } else if (areaSelector < 0.85) { // 15% chance - thumb
          left = Math.random() * 15 + 15; // 15-30%
          top = Math.random() * 30 + 20; // 20-50%
        } else { // 15% chance - index finger
          left = Math.random() * 15 + 40; // 40-55%
          top = Math.random() * 25 + 20; // 20-45%
        }
      } else {
        // Regular surface - distribute randomly with some clustering
        const clusterChance = Math.random();
        if (clusterChance < 0.3) {
          // Create clusters of particles
          const clusterX = Math.random() * 80 + 10;
          const clusterY = Math.random() * 60 + 20;
          left = clusterX + (Math.random() - 0.5) * 15;
          top = clusterY + (Math.random() - 0.5) * 15;
        } else {
          // Random distribution
          left = Math.random() * 90 + 5; // 5-95%
          top = Math.random() * 70 + 15; // 15-85%
        }
      }
      
      // Set spot style
      spot.style.width = `${size}px`;
      spot.style.height = `${size}px`;
      spot.style.backgroundColor = color;
      spot.style.left = `${left}%`;
      spot.style.top = `${top}%`;
      spot.style.opacity = '0';
      spot.style.transform = 'scale(0.5)';
      spot.style.boxShadow = `0 0 ${Math.floor(size)}px ${color}`; // Add glow effect
      spot.style.transition = 'all 0.3s';
      
      surface.appendChild(spot);
      spots.push(spot);
    }
    
    return spots;
  };

  return (
    <>
      {/* Bottom surface - floor/ground */}
      <div 
        ref={bottomSurfaceRef}
        className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-gray-800/40 to-transparent"
        aria-hidden="true"
      />
      
      {/* Left surface - wall or vertical surface */}
      <div 
        ref={leftSurfaceRef}
        className="absolute top-1/4 bottom-1/4 left-0 w-1/6 bg-gradient-to-r from-gray-800/30 to-transparent"
        aria-hidden="true"
      />
      
      {/* Right surface - wall or vertical surface */}
      <div 
        ref={rightSurfaceRef}
        className="absolute top-1/4 bottom-1/4 right-0 w-1/6 bg-gradient-to-l from-gray-800/30 to-transparent"
        aria-hidden="true"
      />
      
      {/* Hand outline - showing where GSR typically concentrates */}
      <div 
        ref={handOutlineRef}
        className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-36 h-36 opacity-0"
        aria-hidden="true"
      >
        {/* Improved SVG hand outline with better detail for the web between thumb and index finger */}
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white/40 fill-transparent stroke-[1.5]">
          {/* Palm */}
          <path d="M30,50 C25,45 20,30 25,20 C30,10 40,15 40,25 L40,65 C40,75 45,85 55,85 C65,85 70,75 70,65 L70,35" />
          {/* Thumb */}
          <path d="M30,50 C25,55 15,55 10,45 C5,35 10,25 20,25 C25,25 30,30 30,35" />
          {/* Index finger */}
          <path d="M70,35 C70,25 75,15 85,20 C95,25 90,40 80,45" />
          {/* Web between thumb and index - highlighted area */}
          <path d="M30,35 C35,30 45,25 55,30 C65,35 70,35 70,35" className="stroke-white/60 stroke-[2]" />
          {/* Annotation for web area */}
          <circle cx="40" cy="40" r="8" className="stroke-white/70 stroke-dasharray-2" />
        </svg>
      </div>
    </>
  );
};

export default SurfaceAnimation;