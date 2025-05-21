"use client";

import React from "react";

interface PhaseTextProps {
  phase: number;
  className?: string;
}

/**
 * Component that displays different text content based on the current animation phase
 */
const PhaseText: React.FC<PhaseTextProps> = ({ phase, className = "" }) => {
  // Text content based on animation phase
  const getPhaseContent = () => {
    switch (phase) {
      case 0:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2">
              The Discharge Process
            </h3>
            <p>
              Scroll to see the chemical transformation during firearm
              discharge.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Watch as the firing pin strikes the primer, initiating a chain
              reaction.
            </p>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2 text-amber-400">
              Primer Ignition
            </h3>
            <p>
              The firing pin strikes the primer, creating a small explosion that
              ignites the propellant.
            </p>
            <p className="mt-2">
              Temperature:{" "}
              <span className="text-red-400 font-semibold">~1500°C</span>
            </p>
            <p className="mt-1 text-sm">
              The primer contains compounds like lead styphnate, barium nitrate,
              and antimony sulfide that are sensitive to impact.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2 text-orange-500">
              Propellant Combustion
            </h3>
            <p>
              The propellant rapidly burns, creating expanding gases under
              extreme pressure.
            </p>
            <p className="mt-2">
              Temperature:{" "}
              <span className="text-red-500 font-semibold">~2500°C</span>
            </p>
            <p>
              Pressure: <span className="font-semibold">Up to 50,000 psi</span>
            </p>
            <p className="mt-1 text-sm">
              This rapid chemical reaction transforms solid propellant into hot,
              expanding gases in milliseconds.
            </p>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2 text-red-500">
              Material Vaporization
            </h3>
            <p>
              The extreme heat vaporizes metals from the primer, bullet, and
              cartridge case.
            </p>
            <div className="mt-2 p-2 bg-black/20 rounded-md">
              <p className="font-semibold">Vaporized Elements:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Lead, barium, and antimony from the primer</li>
                <li>Copper and zinc from the cartridge case</li>
                <li>Lead and other metals from the bullet</li>
              </ul>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">
              GSR Particle Formation
            </h3>
            <p>
              As the vaporized metals cool, they condense into microscopic
              spherical particles.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <p>
                  Typical GSR particle size:{" "}
                  <span className="font-semibold">0.5-10 micrometers</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <p>
                  Characteristic elements:{" "}
                  <span className="font-semibold">Lead, Barium, Antimony</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <p>
                  Spherical shape due to:{" "}
                  <span className="font-semibold">
                    Surface tension during cooling
                  </span>
                </p>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`w-full p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-500 ${className}`}
    >
      {getPhaseContent()}
    </div>
  );
};

export default PhaseText;
