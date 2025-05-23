"use client";

import React, { useEffect, useRef } from 'react'; // Removed useState
import { gsap } from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'; // Added import
import Section from '../shared/Section';
import { ArrowDown } from 'lucide-react';

interface Section1Props {
  onContinue?: () => void;
}

// Helper function to split text into spans for character animation
const SplitText: React.FC<{text: string; className?: string}> = ({ text, className = '' }) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span key={index} className="inline-block char" style={{ opacity: 0 }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const Section1_Introduction: React.FC<Section1Props> = ({ onContinue }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion(); // Added hook

  useEffect(() => {
    // Capture the current value of the ref for use in the effect and cleanup
    const currentSectionElement = sectionRef.current;

    // Create a timeline for the animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (!prefersReducedMotion) {
      // Animate the title characters
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        tl.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.03,
          delay: 0.5
        });
      }

      // Animate the paragraph
      if (textRef.current) { // Ensure ref is current before animating
        tl.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8
        }, "-=0.2");
      }
      
      if (ctaRef.current) { // Ensure ref is current before animating
        tl.to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6
        }, "-=0.2");
      }

      // Optional: Add a subtle background animation
      if (currentSectionElement) {
        gsap.to(currentSectionElement, {
          backgroundPosition: '100% 100%',
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: 'none'
        });
      }
    } else {
      // If reduced motion is preferred, set elements to their final state directly
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.set(chars, { opacity: 1, y: 0 });
      }
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 1, y: 0 });
      }
      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      }
      // No background animation if reduced motion is preferred,
      // but ensure initial styles don't hide content.
      // The inline styles already set opacity: 0, transform: 'translateY(20px)'
      // So we need to override them here if motion is reduced.
      if (textRef.current && textRef.current.style.opacity === '0') {
         gsap.set(textRef.current, { opacity: 1, y: 0 });
      }
      if (ctaRef.current && ctaRef.current.style.opacity === '0') {
         gsap.set(ctaRef.current, { opacity: 1, y: 0 });
      }
    }

    return () => {
      // Clean up animations
      tl.kill();
      if (currentSectionElement) { // Use the captured value in cleanup
        gsap.killTweensOf(currentSectionElement);
      }
    };
  }, [prefersReducedMotion]); // Added prefersReducedMotion to dependency array

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      // Default behavior: scroll to the next section
      const ammunitionSection = document.getElementById('ammunition');
      if (ammunitionSection) {
        ammunitionSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  return (
    <Section id="introduction" className="relative overflow-hidden min-h-screen">
      <div 
        ref={sectionRef}
        className="absolute inset-0" /* Removed background gradient */
        style={{ backgroundSize: '200% 200%', backgroundPosition: '0% 0%' }}
        aria-hidden="true"
      ></div> {/* Ensure it's a div if it was self-closing before and had content/purpose beyond bg */}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <h1 
          ref={titleRef} 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          aria-label="GSR Particle Formation"
        >
          <SplitText text="GSR Particle Formation" />
        </h1>
        
        <p 
          ref={textRef} 
          className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          Explore the fascinating world of Gunshot Residue particles through this interactive visualization. Discover how GSR forms, disperses, and what it reveals about firearms discharge.
        </p>
        
        <div 
          ref={ctaRef} 
          className="mt-16"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <div className="animate-bounce">
            <button 
              onClick={handleContinue}
              className="group flex flex-col items-center gap-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-full p-2"
              aria-label="Scroll to next section"
            >
              <span className="text-sm text-primary/80 group-hover:text-primary group-focus:text-primary">Explore</span>
              <ArrowDown className="w-8 h-8 text-primary/80 group-hover:text-primary group-focus:text-primary" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Section1_Introduction;