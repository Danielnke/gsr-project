"use client";

import React, { useEffect, useState } from 'react';

interface NavigationProps {
  sections: Array<{
    id: string;
    title: string;
  }>;
  debug?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ sections, debug = false }) => {
  const [activeSection, setActiveSection] = useState<string>('');

  // Track the active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently most visible in the viewport
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(item => item.element !== null);

      // Find the section that is most visible in the viewport
      let mostVisibleSection = '';
      let maxVisibility = 0;

      sectionElements.forEach(({ id, element }) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate visibility as a percentage of the viewport height
        const visibility = visibleHeight / viewportHeight;
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = id;
        }
      });

      if (mostVisibleSection && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection);
        if (debug) console.log(`[Navigation] Active section changed to: ${mostVisibleSection}`);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections, activeSection, debug]);

  const scrollToSection = (id: string) => {
    if (debug) console.log(`[Navigation] Attempting to scroll to section: ${id}`);
    
    try {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
        if (debug) console.log(`[Navigation] Successfully scrolled to section: ${id}`);
      } else {
        console.warn(`[Navigation] Element with id "${id}" not found in the document`);
      }
    } catch (error) {
      console.error(`[Navigation] Error scrolling to section ${id}:`, error);
    }
  };

  return (
    <nav className="fixed top-4 right-4 z-50" data-testid="navigation">
      <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-2">
        {debug && <div className="text-xs text-center mb-2 text-primary">Nav Debug: {activeSection}</div>}
        <ul className="flex flex-col gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeSection === section.id ? 'bg-primary text-white' : 'hover:bg-primary/10'}`}
                aria-label={`Scroll to ${section.title} section`}
                data-section-id={section.id}
                aria-current={activeSection === section.id ? 'true' : 'false'}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;