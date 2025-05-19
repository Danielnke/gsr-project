"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../shared/Section';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Section3_Discharge: React.FC = () => {
  // Refs for animation targets
  const sectionRef = useRef<HTMLDivElement>(null);
  const firingPinRef = useRef<SVGPathElement>(null);
  const primerRef = useRef<SVGCircleElement>(null);
  const flashRef = useRef<SVGPathElement>(null);
  const propellantRef = useRef<SVGRectElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // State to track animation progress
  const [animationPhase, setAnimationPhase] = useState(0);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  
  // Function to create particle elements
  const createParticles = (container: HTMLElement, count: number) => {
    // Clear existing particles
    container.innerHTML = '';
    
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
    }
    
    return container.childNodes;
  };
  
  // Main animation sequence
  const playDischargeAnimation = () => {
    if (!sectionRef.current || !firingPinRef.current || !primerRef.current || 
        !flashRef.current || !propellantRef.current || !particlesContainerRef.current) {
      console.error('Animation refs not ready');
      return;
    }
    
    // Create the particles
    const particles = createParticles(particlesContainerRef.current, 50);
    
    // Create the main timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => setAnimationPlayed(true)
    });
    
    // 1. Firing pin strikes primer
    tl.to(firingPinRef.current, {
      x: 0,
      y: 0,
      duration: 0.2,
      ease: 'power4.in',
      onComplete: () => setAnimationPhase(1)
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
      onComplete: () => setAnimationPhase(2)
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
      onComplete: () => setAnimationPhase(3)
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
      ease: 'power1.in',
      onComplete: () => setAnimationPhase(4)
    }, '+=0.5');
    
    // Play the animation
    tl.play();
    
    return tl;
  };
  
  // Set up scroll trigger for the animation
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        if (!animationPlayed) {
          const tl = playDischargeAnimation();
          return () => tl?.kill();
        }
      },
      onLeaveBack: () => {
        setAnimationPhase(0);
        setAnimationPlayed(false);
      }
    });
    
    // Clean up
    return () => {
      scrollTrigger.kill();
    };
  }, [animationPlayed]);
  
  // Text content based on animation phase
  const getPhaseText = () => {
    switch(animationPhase) {
      case 0:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">The Discharge Process</h3>
            <p>Scroll to see the chemical transformation during firearm discharge.</p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Primer Ignition</h3>
            <p>The firing pin strikes the primer, creating a small explosion that ignites the propellant.</p>
            <p className="mt-2">Temperature: ~1500°C</p>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Propellant Combustion</h3>
            <p>The propellant rapidly burns, creating expanding gases under extreme pressure.</p>
            <p className="mt-2">Temperature: ~2500°C</p>
            <p>Pressure: Up to 50,000 psi</p>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Material Vaporization</h3>
            <p>The extreme heat vaporizes metals from the primer, bullet, and cartridge case.</p>
            <p className="mt-2">Lead, barium, and antimony from the primer</p>
            <p>Copper and zinc from the cartridge case</p>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">GSR Particle Formation</h3>
            <p>As the vaporized metals cool, they condense into microscopic spherical particles.</p>
            <p className="mt-2">Typical GSR particle size: 0.5-10 micrometers</p>
            <p>Characteristic elements: Lead, Barium, Antimony</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Section id="discharge" className="bg-primary/10 relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Chemical Transformation During Discharge</h2>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          When a firearm is discharged, a rapid series of chemical reactions occurs under extreme heat and pressure.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Animation Container */}
          <div className="relative w-full max-w-md aspect-square bg-black/10 rounded-xl overflow-hidden">
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
            
            {/* Particle Container (for GSR particles) */}
            <div 
              ref={particlesContainerRef} 
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            />
          </div>
          
          {/* Text Explanation */}
          <div 
            ref={textRef} 
            className="w-full max-w-md p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-500"
          >
            {getPhaseText()}
          </div>
        </div>
        
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-lg">During this process, temperatures can reach over 2,000°C in milliseconds.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The rapid cooling of vaporized metals creates the characteristic spherical GSR particles.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Section3_Discharge;