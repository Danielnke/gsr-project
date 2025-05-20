"use client";

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AppProvider } from '@/lib/context';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppProvider>
        {children}
      </AppProvider>
    </ThemeProvider>
  );
};

export default Providers;