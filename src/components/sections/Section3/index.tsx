"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../../shared/Section';
import DischargeAnimation, { DischargeAnimationRef } from './DischargeAnimation';
import PhaseText from './PhaseText';

// Register the ScrollTrigger plugin only on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Section 3: Chemical Transformation During Discharge
 * 
 * This section visualizes the chemical reactions that occur during
 * firearm discharge, including animations for firing pin, combustion,
 * melting, and GSR particle formation.
 */
const Section3_Discharge: React.FC = () => {
  // Refs for animation control
  const sectionRef = useRef<HTMLDivElement>(null);
  // Use the correct type for the ref
  const animationRef = useRef<DischargeAnimationRef>(null);
  
  // State to track animation phase
  const [animationPhase, setAnimationPhase] = useState(0);
  const [animationPlayed, setAnimationPlayed] = useState(false);
  
  // Handle phase changes from the animation component - memoized to prevent unnecessary re-renders
  const handlePhaseChange = useCallback((phase: number) => {
    setAnimationPhase(phase);
  }, []);
  
  // Set up scroll trigger for the animation
  useEffect(() => {
    if (!sectionRef.current || !animationRef.current) return;
    
    // Create scroll trigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        if (!animationPlayed && animationRef.current) {
          animationRef.current.activate();
          setAnimationPlayed(true);
        }
      },
      onLeaveBack: () => {
        if (animationPlayed && animationRef.current) {
          animationRef.current.reset();
          setAnimationPlayed(false);
        }
      }
    });
    
    // Clean up
    return () => {
      scrollTrigger.kill();
    };
  }, [animationPlayed]); // Include animationPlayed in dependencies

  return (
    <Section id="discharge" className="relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Chemical Transformation During Discharge</h2>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          When a firearm is discharged, a rapid series of chemical reactions occurs under extreme heat and pressure.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Animation Component */}
          <DischargeAnimation 
            ref={animationRef}
            onPhaseChange={handlePhaseChange} 
            className="w-full max-w-md"
          />
          
          {/* Text Explanation */}
          <PhaseText 
            phase={animationPhase} 
            className="w-full max-w-md"
          />
        </div>
        
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-lg">During this process, temperatures can reach over 2,000u00b0C in milliseconds.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The rapid cooling of vaporized metals creates the characteristic spherical GSR particles.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Section3_Discharge;