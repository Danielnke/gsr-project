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
 * Section 3: Discharge Animation
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
    console.log("Section3_Discharge: Component did mount and useEffect is running.");

    // Temporarily simplified to debug if this useEffect runs at all
    if (!sectionRef.current || !animationRef.current) {
      console.log("Section3_Discharge: Refs not available on mount. sectionRef:", sectionRef.current, "animationRef:", animationRef.current);
      return;
    }
    console.log("Section3_Discharge: Refs ARE available. Setting up ScrollTrigger.");

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        console.log("Section3_Discharge: ScrollTrigger onEnter. animationPlayed:", animationPlayed);
        if (!animationPlayed && animationRef.current) {
          console.log("Section3_Discharge: Activating animation.");
          animationRef.current.activate();
          setAnimationPlayed(true);
        }
      },
      onLeaveBack: () => {
        console.log("Section3_Discharge: ScrollTrigger onLeaveBack. animationPlayed:", animationPlayed);
        if (animationPlayed && animationRef.current) {
          console.log("Section3_Discharge: Resetting animation.");
          animationRef.current.reset();
          setAnimationPlayed(false);
        }
      }
    });
    console.log("Section3_Discharge: ScrollTrigger instance created:", st);

    return () => {
      console.log("Section3_Discharge: Cleaning up ScrollTrigger.");
      st.kill();
    };
  }, []); // Using empty dependency array to run only on mount for now

  return (
    <Section id="discharge" className="relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        {/* Removed heading and description to focus on animation and other content */}
        
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
          <p className="text-lg">Temperatures during discharge can exceed 2,000°C, critical for forensic analysis of GSR particles.</p>
        </div>
      </div>
    </Section>
  );
};

export default Section3_Discharge;
