import React, { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine"; // Import Engine type
import { gsap } from 'gsap';
import { getParticleConfig } from './ParticleConfig';
import SurfaceAnimation from './SurfaceAnimation';

interface DispersionAnimationProps {
  animationPhase: number;
}

const DispersionAnimation: React.FC<DispersionAnimationProps> = ({ animationPhase }) => {
  // Refs for animation elements
  const containerRef = useRef<HTMLDivElement>(null);
  const firearmRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const muzzleFlashRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [init, setInit] = useState(false); // State to track engine initialization

  // Initialize the tsParticles engine instance
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => { // Add Engine type
      // console.log("Initializing particles engine in DispersionAnimation");
      // await loadFull(engine); // if you are going to use `loadFull`, install the "tsparticles" package too.
      await loadSlim(engine); // or `loadFull(engine)` if you installed the "tsparticles" package
      // console.log("Particles engine loaded in DispersionAnimation");
    }).then(() => {
      // console.log("initParticlesEngine resolved in DispersionAnimation");
      setInit(true);
    }).catch((error: unknown) => { // Add any type for error for now
      console.error("Error initializing particles engine in DispersionAnimation:", error);
    });
  }, []);
  
  // Animate the firearm and muzzle flash based on animation phase
  useEffect(() => {
    if (!firearmRef.current || !muzzleFlashRef.current || !containerRef.current || !glowRef.current) return;
    
    const tl = gsap.timeline();
    
    // Initial setup
    tl.set(firearmRef.current, { 
      opacity: 0, 
      x: -20 
    });
    
    tl.set(muzzleFlashRef.current, { 
      opacity: 0, 
      scale: 0 
    });
    
    tl.set(glowRef.current, {
      opacity: 0,
      scale: 0
    });
    
    // Phase 0: Show the firearm
    if (animationPhase >= 0) {
      tl.to(firearmRef.current, {
        opacity: 0.8,
        x: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Phase 1: Show muzzle flash and start particle emission
    if (animationPhase >= 1) {
      // Add a subtle glow effect before the muzzle flash
      tl.to(glowRef.current, {
        opacity: 0.7,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
      // Show the muzzle flash
      .to(muzzleFlashRef.current, {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
        ease: "power4.out"
      })
      // Fade out the muzzle flash
      .to(muzzleFlashRef.current, {
        opacity: 0,
        scale: 1.5,
        duration: 0.5,
        ease: "power2.in"
      })
      // Fade out the glow
      .to(glowRef.current, {
        opacity: 0,
        scale: 2,
        duration: 0.8,
        ease: "power2.in"
      }, "-=0.4");
      
      // Add a realistic recoil effect to the firearm
      tl.to(firearmRef.current, {
        x: -15,
        rotation: -8,
        duration: 0.15,
        ease: "power4.out"
      }, "-=1.2")
      .to(firearmRef.current, {
        x: -5,
        rotation: -3,
        duration: 0.2,
        ease: "power1.out"
      })
      .to(firearmRef.current, {
        x: 0,
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    }
    
    // Phase 2+: Fade out the firearm slightly to focus on particles
    if (animationPhase >= 2) {
      tl.to(firearmRef.current, {
        opacity: 0.4,
        duration: 1,
        ease: "power1.out"
      });
    }
    
    return () => {
      tl.kill();
    };
  }, [animationPhase]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md aspect-square bg-black/40 rounded-xl overflow-hidden shadow-lg border border-white/10"
      style={{
        background: "radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.6) 100%)"
      }}
    >
      {/* Background glow for discharge */}
      <div
        ref={glowRef}
        className="absolute left-[100px] top-1/2 transform -translate-y-1/2 w-40 h-40 rounded-full opacity-0 z-10"
        style={{
          background: "radial-gradient(circle, rgba(255,200,50,0.3) 0%, rgba(255,150,0,0.1) 50%, rgba(255,100,0,0) 100%)",
          filter: "blur(8px)",
          transform: "translate(-50%, -50%)"
        }}
      />
      
      {/* Improved firearm silhouette */}
      <div 
        ref={firearmRef}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 z-20"
      >
        <svg width="120" height="50" viewBox="0 0 120 50" className="fill-white/80">
          {/* Improved pistol silhouette */}
          <path d="M0,25 L60,25 L60,15 L80,15 L80,35 L60,35 L60,30 L40,30 L40,35 L30,35 L30,30 L0,30 Z" />
          {/* Trigger guard */}
          <path d="M35,30 C35,35 35,40 40,40 C45,40 45,35 45,30 Z" />
          {/* Trigger */}
          <rect x="38" y="30" width="4" height="7" />
          {/* Barrel */}
          <rect x="80" y="20" width="30" height="10" />
          {/* Sight */}
          <rect x="70" y="12" width="5" height="3" />
          {/* Grip texture */}
          <path d="M5,25 L5,30 M10,25 L10,30 M15,25 L15,30 M20,25 L20,30 M25,25 L25,30" 
                className="stroke-white/40 stroke-1 fill-none" />
        </svg>
      </div>
      
      {/* Improved muzzle flash */}
      <div 
        ref={muzzleFlashRef}
        className="absolute left-[110px] top-1/2 transform -translate-y-1/2 z-30"
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          {/* Central flash */}
          <path d="M0,30 L30,15 L20,30 L30,45 Z" className="fill-yellow-400" />
          
          {/* Outer glow */}
          <path d="M0,30 L40,10 L25,30 L40,50 Z" className="fill-yellow-500/70" />
          
          {/* Central bright spot */}
          <circle cx="15" cy="30" r="10" className="fill-white" />
          
          {/* Smaller flares */}
          <path d="M15,10 L20,25 L25,10" className="fill-yellow-300/80" />
          <path d="M15,50 L20,35 L25,50" className="fill-yellow-300/80" />
        </svg>
      </div>
      
      {/* Particles container */}
      <div 
        ref={particlesContainerRef}
        className="absolute inset-0 z-0"
      >
        {/* Particles */}
        {init && ( // Render Particles only after engine is initialized
          <Particles
            id="tsparticles-dispersion" // Ensure unique ID if multiple particle instances
            options={getParticleConfig(animationPhase)}
            className="absolute inset-0"
          />
        )}
      </div>
      
      {/* Surfaces for particle deposition */}
      <SurfaceAnimation animationPhase={animationPhase} />
      
      {/* Informational labels that appear in later phases */}
      {animationPhase >= 2 && (
        <div className="absolute top-2 left-2 right-2 flex justify-between text-xs text-white/80 z-40">
          <span className="bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            GSR Cloud
          </span>
          <span className="bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            {animationPhase >= 3 ? 'Deposition' : 'Dispersion'}
          </span>
        </div>
      )}
      
      {/* Phase indicator */}
      {animationPhase >= 1 && (
        <div className="absolute bottom-2 right-2 text-xs text-white/70 bg-black/30 px-2 py-1 rounded z-40 backdrop-blur-sm">
          Phase {animationPhase + 1}/5
        </div>
      )}
    </div>
  );
};

export default DispersionAnimation;