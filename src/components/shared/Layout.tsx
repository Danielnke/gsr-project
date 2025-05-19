import React from 'react';
// Removed Navigation import as we're removing the side navigation bar

interface LayoutProps {
  children: React.ReactNode;
  debug?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, debug = false }) => {
  // We still define sections for potential future use, but we won't pass them to Navigation
  const sections = [
    { id: 'introduction', title: 'Intro' },
    { id: 'ammunition', title: 'Ammunition' },
    { id: 'discharge', title: 'Discharge' },
    { id: 'dispersion', title: 'Dispersion' },
    { id: 'conclusion', title: 'Conclusion' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation component removed to eliminate the side navigation bar */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default Layout;