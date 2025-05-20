"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../../shared/Section';
import DispersionAnimation from './DispersionAnimation';
import PhaseText from './PhaseText';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Section4_Dispersion: React.FC = () => {
  // Refs for animation targets
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressIndicatorRef = useRef<HTMLDivElement>(null);
  const phaseButtonsRef = useRef<HTMLDivElement>(null);
  
  // State to track animation progress
  const [animationPhase, setAnimationPhase] = useState(0);
  // const [userInteracted, setUserInteracted] = useState(false); // No longer needed for auto-play logic
  // const userInteractedRef = useRef(userInteracted); // No longer needed

  // useEffect(() => { // No longer needed
  //   userInteractedRef.current = userInteracted;
  // }, [userInteracted]);
  
  // Handle manual phase navigation
  const setPhase = (phase: number) => {
    if (phase >= 0 && phase <= 4) {
      setAnimationPhase(phase);
      // setUserInteracted(true); // No longer needed for auto-play logic
      
      // Highlight the selected button
      if (phaseButtonsRef.current) {
        const buttons = phaseButtonsRef.current.querySelectorAll('button');
        buttons.forEach((button, index) => {
          if (index === phase) {
            gsap.to(button, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
          } else {
            gsap.to(button, { scale: 1, duration: 0.3 });
          }
        });
      }
    }
  };
  
  // Set up scroll trigger for the animation
  useEffect(() => {
    if (!sectionRef.current || !progressBarRef.current || !progressIndicatorRef.current) return;
    
    // Create a scroll-based progress indicator and phase controller
    const progressScrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: sectionRef.current, // Pin the section
      start: 'top top', // Start pinning when the top of the section hits the top of the viewport
      end: '+=500%', // Pin for a scroll distance equivalent to 500% of viewport height (100% per phase)
      scrub: 0.5, // Smooth scrubbing effect
      onUpdate: (self) => {
        // Update progress indicator based on scroll position
        if (progressIndicatorRef.current) {
          gsap.to(progressIndicatorRef.current, {
            width: `${self.progress * 100}%`,
            duration: 0.1, // Keep duration low for responsiveness to scrub
          });
          
          // Scroll always updates the phase if it's different
          const newPhase = Math.min(4, Math.floor(self.progress * 5)); // 5 phases (0-4)
          if (newPhase !== animationPhase) { // Check current animationPhase from state
            setAnimationPhase(newPhase);
          }
        }
      }
    });
    
    // Clean up
    return () => {
      progressScrollTrigger.kill();
    };
  }, []); // Empty dependency array: setup ScrollTrigger once on mount
  
  // Animation for text content
  useEffect(() => {
    if (!textRef.current) return;
    
    const tl = gsap.timeline();
    
    // Fade out current content
    tl.to(textRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in"
    })
    // Update content (happens in React render)
    // Fade in new content
    .to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out"
    });
    
    return () => {
      tl.kill();
    };
  }, [animationPhase]);

  return (
    <Section id="dispersion" className="relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Particle Dispersion & Deposition</h2>
        
        <p className="text-xl text-center mb-8 max-w-3xl mx-auto">
          After discharge, GSR particles form a cloud that disperses and eventually settles on surfaces.
        </p>
        
        {/* Progress bar */}
        <div 
          ref={progressBarRef}
          className="w-full max-w-3xl mx-auto h-1.5 bg-gray-700/30 rounded-full mb-8 overflow-hidden"
        >
          <div 
            ref={progressIndicatorRef}
            className="h-full bg-primary/80 rounded-full"
            style={{ width: '0%' }}
          />
        </div>
        
        {/* Phase navigation buttons */}
        <div 
          ref={phaseButtonsRef}
          className="flex justify-center gap-3 mb-10"
        >
          {[0, 1, 2, 3, 4].map((phase) => (
            <button
              key={phase}
              onClick={() => setPhase(phase)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                animationPhase === phase 
                  ? 'bg-primary text-white scale-110 shadow-lg' 
                  : 'bg-gray-700/40 text-gray-200 hover:bg-gray-700/60'
              }`}
              aria-label={`View phase ${phase + 1}`}
            >
              {phase + 1}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* Particle Animation Container */}
          <DispersionAnimation animationPhase={animationPhase} />
          
          {/* Text Explanation */}
          <div 
            ref={textRef} 
            className="w-full max-w-md p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-500"
          >
            <PhaseText animationPhase={animationPhase} />
          </div>
        </div>
        
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-lg">GSR particles typically travel up to 3-5 feet from the discharge point.</p>
          <p className="mt-4 text-sm text-muted-foreground">
            The highest concentration is found on the shooter&apos;s hands, especially between the thumb and index finger.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Section4_Dispersion;