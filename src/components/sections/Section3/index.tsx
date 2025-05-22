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
    // Temporarily simplified to debug if this useEffect runs at all
    if (!sectionRef.current || !animationRef.current) {
      return;
    }

    const st = ScrollTrigger.create({
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

    return () => {
      st.kill();
    };
  }, [animationPlayed, animationRef]); // Added animationPlayed and animationRef

  return (
    <Section id="discharge" className="relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full pb-24">
        {/* Heading and Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">The Discharge Process</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Explore the rapid chemical and physical transformations that occur when a firearm is discharged, leading to the formation of Gunshot Residue (GSR).
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:items-center justify-center md:gap-12">
          {/* Animation Component */}
          <DischargeAnimation 
            ref={animationRef}
            onPhaseChange={handlePhaseChange} 
            className="w-full"
          />
          
          {/* Text Explanation */}
          <PhaseText 
            phase={animationPhase} 
            className="w-full"
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
