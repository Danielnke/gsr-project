"use client";

import React, { useEffect, useRef, useState } from 'react';
import '../../styles/scroll-animations.css';
import { useAppContext } from '@/lib/context';

interface ScrollSnapContainerProps {
  children: React.ReactNode;
  debug?: boolean;
}

// Fallback state to use if context fails
const fallbackState = {
  currentSection: 'unknown',
  debug: false
};

const ScrollSnapContainer: React.FC<ScrollSnapContainerProps> = ({ children, debug = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Add error handling for context
  const [contextError, setContextError] = useState<Error | null>(null);
  const [currentSection, setCurrentSection] = useState('unknown');
  
  // Try to use the context, but handle errors gracefully
  let contextState = fallbackState;
  let contextDispatch: React.Dispatch<any> | null = null;
  
  try {
    // Wrap this in try/catch to handle potential context errors
    const context = useAppContext();
    contextState = context.state;
    contextDispatch = context.dispatch;
    
    // Debug logging
    if (debug) {
      console.log('[ScrollContainer] Successfully connected to AppContext', contextState);
    }
  } catch (error) {
    // If context fails, log the error and use fallback state
    console.error('[ScrollContainer] Error using AppContext:', error);
    setContextError(error as Error);
  }

  // Setup scroll animations with Intersection Observer
  useEffect(() => {
    // Debug logging
    if (debug) {
      console.log('[ScrollContainer] Component mounted with debug:', debug);
      console.log('[ScrollContainer] Context state:', contextState);
      console.log('[ScrollContainer] Context error:', contextError);
    }
    
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
        const sectionId = section.id || 'unknown';

        if (entry.isIntersecting) {
          // Update local state
          setCurrentSection(sectionId);
          
          // Try to update context if available
          if (contextDispatch) {
            try {
              contextDispatch({ type: 'SET_CURRENT_SECTION', payload: sectionId });
              if (debug) console.log(`[ScrollContainer] Updated context with section: ${sectionId}`);
            } catch (error) {
              console.error(`[ScrollContainer] Failed to dispatch section change:`, error);
            }
          } else if (debug) {
            console.log(`[ScrollContainer] Section ${sectionId} is visible (context unavailable)`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sections.forEach(section => observer.observe(section));

    return () => {
      if (debug) console.log('[ScrollContainer] Cleaning up observer');
      observer.disconnect();
    };
  }, [debug, contextDispatch, contextState, contextError]);

  // Show error UI if context failed
  if (contextError && debug) {
    console.warn('[ScrollContainer] Rendering with fallback state due to context error');
  }

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
          Active Section: {contextError ? currentSection : contextState.currentSection}
          {contextError && (
            <>
              <br /><span className="text-red-400">Context Error: {contextError.message}</span>
            </>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default ScrollSnapContainer;