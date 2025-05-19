"use client";

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/scroll-animations.css';

interface ScrollSnapContainerProps {
  children: React.ReactNode;
  debug?: boolean;
}

const ScrollSnapContainer: React.FC<ScrollSnapContainerProps> = ({ children, debug = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // Setup scroll animations with Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      if (debug) console.log('[ScrollContainer] Container ref is null');
      return;
    }

    if (debug) console.log('[ScrollContainer] Setting up scroll animations');

    // Get all sections
    const sections = Array.from(container.querySelectorAll('section'));
    
    if (debug) console.log(`[ScrollContainer] Found ${sections.length} sections`);

    // Make sure all sections are visible
    sections.forEach(section => {
      // Add the scroll-section class for styling
      section.classList.add('scroll-section');
      
      // Ensure no sections have the hidden class
      section.classList.remove('hidden');
      
      // Ensure no sections have the fade-out class
      section.classList.remove('fade-out');
      
      // Make sure all sections are fully visible
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    });

    // Create intersection observer just to track which section is active
    const observerOptions = {
      root: null, // Use viewport as root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const section = entry.target as HTMLElement;
        const sectionId = section.id;

        if (entry.isIntersecting) {
          // Just track which section is currently most visible
          setActiveSection(sectionId);
          if (debug) console.log(`[ScrollContainer] Section ${sectionId} is now visible`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sections.forEach(section => observer.observe(section));

    return () => {
      if (debug) console.log('[ScrollContainer] Cleaning up observer');
      observer.disconnect();
    };
  }, [debug]);

  return (
    <div 
      ref={containerRef}
      // Changed from h-screen to min-h-screen to allow content to flow naturally
      className="min-h-screen overflow-y-auto overflow-x-hidden"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch', // For iOS momentum scrolling
      }}
      data-testid="scroll-container"
    >
      {debug && (
        <div className="fixed top-0 right-0 bg-black/50 text-white p-2 z-50 text-xs">
          Scroll Debug Mode<br />
          Active Section: {activeSection}
        </div>
      )}
      {children}
    </div>
  );
};

export default ScrollSnapContainer;