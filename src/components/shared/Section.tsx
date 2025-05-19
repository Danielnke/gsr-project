import React from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, className = '', children }) => {
  return (
    <section 
      id={id}
      // Changed from min-h-screen to make sure content flows naturally
      className={`w-full flex flex-col items-center justify-center p-6 py-20 ${className}`}
      data-section-id={id}
    >
      {children}
    </section>
  );
};

export default Section;