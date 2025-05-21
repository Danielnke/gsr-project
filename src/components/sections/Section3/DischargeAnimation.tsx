"use client";

import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleSystem from "./ParticleSystem";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
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
const DischargeAnimation = forwardRef<
  DischargeAnimationRef,
  DischargeAnimationProps
>(({ onPhaseChange, className = "" }, ref) => {
  // Refs for animation targets
  const containerRef = useRef<HTMLDivElement>(null);
  const firingPinRef = useRef<SVGPathElement>(null);
  const primerRef = useRef<SVGCircleElement>(null);
  const flashRef = useRef<SVGPathElement>(null);
  const propellantRef = useRef<SVGRectElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const cartridgeRef = useRef<SVGRectElement>(null);
  const heatGlowRef = useRef<SVGRadialGradientElement>(null);
  const sparklesRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<HTMLDivElement[] | null>(null);

  // State to track animation
  const [isActive, setIsActive] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);

  // Handle particles creation
  const handleParticlesCreated = (newParticles: HTMLDivElement[]) => {
    particlesRef.current = newParticles;
    setParticlesReady(true);
  };

  // Initial setup for animation elements
  useEffect(() => {
    if (!firingPinRef.current) return;

    // Set initial position of firing pin (pulled back)
    gsap.set(firingPinRef.current, {
      translateY: -30,
    });

    // Set flash to be invisible initially
    if (flashRef.current) {
      gsap.set(flashRef.current, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });
    }

    // Set smoke to be invisible initially
    if (smokeRef.current) {
      gsap.set(smokeRef.current, {
        opacity: 0,
      });
    }

    // Set sparkles to be invisible initially
    if (sparklesRef.current) {
      gsap.set(sparklesRef.current, {
        opacity: 0,
      });
    }

    // Position the entire animation in the center of the container
    // This fixes the alignment issue
    if (containerRef.current) {
      gsap.set(".animation-container", {
        y: 20, // Adjust this value to move the animation up
      });
    }
  }, []);

  // Main animation sequence
  useEffect(() => {
    // Only proceed if active, elements exist, and particles are ready
    if (
      !isActive ||
      !firingPinRef.current ||
      !primerRef.current ||
      !flashRef.current ||
      !propellantRef.current
    ) {
      return;
    }

    // Get particles from ref
    const particles = particlesRef.current;
    if (!particlesReady || !particles || particles.length === 0) return;

    // Store the phase change function to avoid closure issues
    const phaseChangeFn = onPhaseChange;

    // Create the main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(4); // Final phase
      },
    });

    // Create a separate timeline for sparkles
    const sparklesTl = gsap.timeline({ repeat: -1, yoyo: true });
    if (sparklesRef.current) {
      const sparkles = sparklesRef.current.children;
      sparklesTl.to(sparkles, {
        opacity: (_i) => 0.3 + Math.random() * 0.7,
        scale: (_i) => 0.8 + Math.random() * 0.5,
        duration: (_i) => 0.3 + Math.random() * 0.5,
        stagger: 0.05,
        ease: "power1.inOut",
      });
    }

    // 1. Firing pin strikes primer
    tl.to(firingPinRef.current, {
      translateY: 0,
      duration: 0.2,
      ease: "power4.in",
      onComplete: () => {
        if (phaseChangeFn) phaseChangeFn(1);
      },
    })

      // 2. Primer deforms and flash appears
      .to(
        primerRef.current,
        {
          fill: "#ff6600",
          scale: 1.1,
          transformOrigin: "center center",
          duration: 0.1,
          ease: "power2.out",
        },
        "-=0.05",
      )

      // 3. Flash appears
      .to(
        flashRef.current,
        {
          opacity: 1,
          scale: 1.5,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            if (phaseChangeFn) phaseChangeFn(2);
          },
        },
        "-=0.05",
      )

      // 4. Propellant begins to heat up (gradual color change)
      .to(
        propellantRef.current,
        {
          fill: "#ff9900", // Start with orange
          duration: 0.3,
          ease: "power1.in",
        },
        "-=0.1",
      )

      // 5. Propellant gets hotter (deeper red)
      .to(propellantRef.current, {
        fill: "#ff3300", // Then intense red
        duration: 0.3,
        ease: "power2.in",
      })

      // 6. Show sparkles as propellant heats up
      .to(
        sparklesRef.current,
        {
          opacity: 1,
          duration: 0.2,
          ease: "power1.out",
          onStart: () => {
            // Start the sparkle animation
            sparklesTl.play();
          },
        },
        "-=0.3",
      )

      // 7. Smoke appears
      .to(
        smokeRef.current,
        {
          opacity: 0.7,
          duration: 0.5,
          ease: "power1.out",
        },
        "-=0.2",
      )

      // 8. Particles start forming and dispersing - BURST EFFECT
      .to(particles, {
        opacity: 1,
        scale: (_i) => 0.5 + Math.random() * 1.5, // Varied scale for more dynamic look
        duration: 0.1, // Faster for burst effect
        stagger: 0.002, // Much faster stagger for burst effect
        ease: "power4.out",
        onComplete: () => {
          if (phaseChangeFn) phaseChangeFn(3);
          // Stop the sparkle animation when particles burst
          sparklesTl.pause();
        },
      })

      // 9. Particles explode outward with initial transformation (epic burst effect)
      .to(
        particles,
        {
          x: () => (Math.random() - 0.5) * 500, // Even more dramatic dispersion
          y: () => (Math.random() - 0.5) * 500, // Even more dramatic dispersion
          opacity: () => Math.random() * 0.8 + 0.2, // Higher opacity for better visibility
          scale: () => Math.random() * 3 + 0.5, // More varied scale for dynamic effect
          rotation: () => Math.random() * 720 - 360, // Full rotation in either direction
          duration: 0.6, // Slightly faster for more explosive feel
          ease: "expo.out", // Explosive easing
        },
        "-=0.05",
      )

      // 10. Simulate chemical transformation with color change (heat effect)
      .to(
        particles,
        {
          backgroundColor: (_i) => {
            // More varied colors for chemical transformation
            const colors = [
              "#ff6347",
              "#ff3300",
              "#ff8c00",
              "#cd5c5c",
              "#dc143c",
            ];
            return colors[Math.floor(Math.random() * colors.length)];
          },
          boxShadow: (_i) => {
            const size = 2 + Math.random() * 6;
            const color = Math.random() > 0.5 ? "#ff6347" : "#ff3300";
            return `0 0 ${size}px ${color}`;
          },
          duration: 0.4,
          stagger: 0.01,
          ease: "power1.inOut",
        },
        "-=0.3", // Overlap with previous animation for smoother effect
      )

      // 11. Some particles fade out (simulating cooling/settling)
      .to(
        particles,
        {
          opacity: (i) => (i % 3 === 0 ? 0 : Math.random() * 0.7 + 0.3),
          scale: (i) => (i % 4 === 0 ? 0.5 : Math.random() * 1.5 + 0.5),
          duration: 0.8,
          stagger: 0.01,
          ease: "power1.in",
        },
        "+=0.3",
      );

    // Clean up
    return () => {
      tl.kill();
      sparklesTl.kill();
    };
  }, [isActive, particlesReady, onPhaseChange]); // Include onPhaseChange in dependencies

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

    // Reset firing pin position
    if (firingPinRef.current) {
      gsap.set(firingPinRef.current, {
        translateY: -30,
      });
    }

    // Reset flash
    if (flashRef.current) {
      gsap.set(flashRef.current, {
        opacity: 0,
        scale: 0,
      });
    }

    // Reset primer
    if (primerRef.current) {
      gsap.set(primerRef.current, {
        fill: "url(#primerGradient)",
        scale: 1,
      });
    }

    // Reset propellant
    if (propellantRef.current) {
      gsap.set(propellantRef.current, {
        fill: "url(#propellantGradient)",
      });
    }

    // Reset smoke
    if (smokeRef.current) {
      gsap.set(smokeRef.current, {
        opacity: 0,
      });
    }

    // Reset sparkles
    if (sparklesRef.current) {
      gsap.set(sparklesRef.current, {
        opacity: 0,
      });
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    activate,
    reset,
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
        <title id="discharge-animation-title">
          Firearm Discharge Animation
        </title>

        {/* Add gradients for realism */}
        <defs>
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#d4af37", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#b87333", stopOpacity: 1 }}
            />
          </linearGradient>
          <radialGradient
            id="primerGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" style={{ stopColor: "#777", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#555", stopOpacity: 1 }} />
          </radialGradient>
          <linearGradient
            id="propellantGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: "#333", stopOpacity: 1 }} />
            <stop
              offset="100%"
              style={{ stopColor: "#ff3300", stopOpacity: 0.5 }}
            />
          </linearGradient>

          {/* Heat glow gradient */}
          <radialGradient
            id="heatGlow"
            ref={heatGlowRef}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#ff3300", stopOpacity: 0.8 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#ff3300", stopOpacity: 0 }}
            />
          </radialGradient>

          {/* Add a simple glow filter for flash */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Add a stronger glow filter for sparkles */}
          <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Group all animation elements for better positioning */}
        <g className="animation-container">
          {/* Heat glow effect (initially invisible) */}
          <circle
            cx="200"
            cy="260"
            r="100"
            fill="url(#heatGlow)"
            opacity="0.6"
            className="heat-glow"
          />

          {/* Cartridge Case with gradient */}
          <rect
            ref={cartridgeRef}
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

          {/* Add subtle smoke effect (initially invisible) */}
          <g ref={smokeRef} opacity="0">
            <circle cx="200" cy="250" r="10" fill="#888" opacity="0.5" />
            <circle cx="210" cy="240" r="8" fill="#888" opacity="0.3" />
            <circle cx="190" cy="260" r="12" fill="#888" opacity="0.4" />
            <circle cx="180" cy="230" r="9" fill="#888" opacity="0.4" />
            <circle cx="220" cy="220" r="11" fill="#888" opacity="0.3" />
          </g>

          {/* Add sparkles for heating effect (initially invisible) */}
          <g ref={sparklesRef} opacity="0">
            {/* Generate multiple sparkles in the propellant area */}
            <circle
              cx="180"
              cy="230"
              r="2"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="190"
              cy="250"
              r="1.5"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="200"
              cy="240"
              r="2"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="210"
              cy="260"
              r="1.5"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="220"
              cy="230"
              r="2"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="185"
              cy="270"
              r="1.5"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="195"
              cy="220"
              r="2"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="215"
              cy="245"
              r="1.5"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="175"
              cy="255"
              r="2"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
            <circle
              cx="205"
              cy="265"
              r="1.5"
              fill="#ffcc00"
              filter="url(#sparkleGlow)"
            />
          </g>
        </g>
      </svg>

      {/* Particle System */}
      <ParticleSystem
        active={isActive}
        count={120} // Increased for more dramatic effect
        onParticlesCreated={handleParticlesCreated}
      />
    </div>
  );
});

export default DischargeAnimation;

// Add display name
DischargeAnimation.displayName = "DischargeAnimation";
