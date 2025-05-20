"use client";

import React from 'react';
// Removed Navigation import as we're removing the side navigation bar

interface LayoutProps {
  children: React.ReactNode;
  debug?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, debug }) => {
  // Sections definition removed as it's not being used
  // Added debug prop to component parameters to fix unused prop warning
  
  // Debug logging to help troubleshoot
  React.useEffect(() => {
    if (debug) {
      console.log('[Layout] Rendering with debug mode:', debug);
    }
  }, [debug]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation component removed to eliminate the side navigation bar */}
      <main className="flex-grow">
        {children}
      </main>
      {debug && (
        <div className="fixed bottom-0 left-0 bg-black/50 text-white p-2 z-50 text-xs">
          Layout Debug Mode
        </div>
      )}
    </div>
  );
};

export default Layout;