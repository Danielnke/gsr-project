"use client";

import React from 'react';

interface PhaseTextProps {
  phase: number;
  className?: string;
}

/**
 * Component that displays different text content based on the current animation phase
 */
const PhaseText: React.FC<PhaseTextProps> = ({ phase, className = '' }) => {
  // Text content based on animation phase
  const getPhaseContent = () => {
    switch(phase) {
      case 0:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">The Discharge Process</h3>
            <p>Scroll to see the chemical transformation during firearm discharge.</p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Primer Ignition</h3>
            <p>The firing pin strikes the primer, creating a small explosion that ignites the propellant.</p>
            <p className="mt-2">Temperature: ~1500°C</p>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Propellant Combustion</h3>
            <p>The propellant rapidly burns, creating expanding gases under extreme pressure.</p>
            <p className="mt-2">Temperature: ~2500°C</p>
            <p>Pressure: Up to 50,000 psi</p>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">Material Vaporization</h3>
            <p>The extreme heat vaporizes metals from the primer, bullet, and cartridge case.</p>
            <p className="mt-2">Lead, barium, and antimony from the primer</p>
            <p>Copper and zinc from the cartridge case</p>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">GSR Particle Formation</h3>
            <p>As the vaporized metals cool, they condense into microscopic spherical particles.</p>
            <p className="mt-2">Typical GSR particle size: 0.5-10 micrometers</p>
            <p>Characteristic elements: Lead, Barium, Antimony</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-500 ${className}`}>
      {getPhaseContent()}
    </div>
  );
};

export default PhaseText;