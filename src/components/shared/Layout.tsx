import React from 'react';
// Removed Navigation import as we're removing the side navigation bar

interface LayoutProps {
  children: React.ReactNode;
  debug?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Sections definition removed as it's not being used

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