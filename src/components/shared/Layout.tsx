"use client";

import React, { useState, useEffect, useRef } from 'react';
import ProgressIndicator from './ProgressIndicator'; // Import the new component

interface SectionInfo {
  id: string;
  label: string;
}

// Define your sections here. These IDs must match the 'id' prop of your <Section> components.
const SECTIONS_CONFIG: SectionInfo[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'ammunition', label: 'Ammunition' },
  { id: 'discharge', label: 'Discharge' },
  { id: 'dispersion', label: 'Dispersion' },
  { id: 'conclusion', label: 'Conclusion' },
];

interface LayoutProps {
  children: React.ReactNode;
  debug?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, debug }) => {
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(SECTIONS_CONFIG[0]?.id || null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    // Debug console log removed
    // if (debug) {
    //   console.log('[Layout] Rendering with debug mode:', debug);
    // }

    // Dynamically find section elements once children are rendered
    // This assumes children (the page content) will eventually render the sections
    // A more robust way might involve a context or direct refs if sections are deeply nested
    // or not immediate children of where Layout is used.
    // For now, we'll query after a short delay.
    const timeoutId = setTimeout(() => {
      SECTIONS_CONFIG.forEach(section => {
        const el = document.getElementById(section.id);
        if (el) {
          sectionRefs.current.set(section.id, el);
        }
      });

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Prioritize entries that are more than 50% visible
              if (entry.intersectionRatio >= 0.5) {
                setCurrentSectionId(entry.target.id);
              }
            }
          });
          // Fallback if no section is >50% visible (e.g. during fast scroll)
          // Find the first intersecting entry from the top
          const firstVisible = entries.find(e => e.isIntersecting);
          if (firstVisible && currentSectionId !== firstVisible.target.id && entries.every(e => e.intersectionRatio < 0.5)) {
             // Check if currentSectionId is not already set to this to avoid loop if it's the only one < 50%
            const currentIdx = SECTIONS_CONFIG.findIndex(s => s.id === currentSectionId);
            const firstVisibleIdx = SECTIONS_CONFIG.findIndex(s => s.id === firstVisible.target.id);
            if (firstVisibleIdx < currentIdx || currentIdx === -1) { // Only update if it's an earlier section or none is set
                 setCurrentSectionId(firstVisible.target.id);
            }
          }
        },
        {
          root: null, // viewport
          threshold: [0.1, 0.5, 0.9], // Check at 10%, 50%, 90% visibility
        }
      );

      sectionRefs.current.forEach(el => observerRef.current?.observe(el));
    }, 100); // Delay to allow sections to render

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      sectionRefs.current.clear();
    };
  }, [debug, children]); // Re-run if children change, as sections might re-render

  const handleNavigate = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Optionally, force update currentSectionId after navigation
      // setCurrentSectionId(sectionId); // GSAP ScrollTrigger might handle this better if used for scroll snapping
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressIndicator
        sections={SECTIONS_CONFIG}
        currentSectionId={currentSectionId}
        onNavigate={handleNavigate}
      />
      <main className="flex-grow">
        {children}
      </main>
      {/* Debug widget removed */}
      {/* {debug && (
        <div className="fixed bottom-0 left-0 bg-black/50 text-white p-2 z-50 text-xs">
          Layout Debug Mode. Current Section: {currentSectionId || 'None'}
        </div>
      )} */}
    </div>
  );
};

export default Layout;