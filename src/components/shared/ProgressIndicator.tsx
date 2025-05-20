"use client";

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility from Shadcn

interface SectionInfo {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  sections: SectionInfo[];
  currentSectionId: string | null;
  onNavigate: (sectionId: string) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  sections, 
  currentSectionId,
  onNavigate
}) => {
  return (
    <nav 
      aria-label="Page section navigation" 
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
    >
      <ul className="space-y-3">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onNavigate(section.id)}
              aria-label={`Go to ${section.label} section`}
              aria-current={currentSectionId === section.id ? 'step' : undefined}
              className={cn(
                "w-3 h-3 rounded-full bg-gray-400 hover:bg-primary focus:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-colors duration-200",
                {
                  "bg-primary scale-125": currentSectionId === section.id,
                }
              )}
              title={section.label}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProgressIndicator;