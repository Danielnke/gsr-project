"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Section from '../shared/Section';
import Hotspot from '../shared/Hotspot';

import AnimatedCartridge from '../shared/AnimatedCartridge'; // Import the new component

const Section2_Ammunition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hotspotsContainerRef = useRef<HTMLDivElement>(null);
  // svgRef and animation-specific refs are now in AnimatedCartridge

  const [isExploded, setIsExploded] = useState(false);

  // Initial scroll-triggered animation for the section (if any, or for the AnimatedCartridge itself if needed)
  // For now, AnimatedCartridge handles its own initial visibility via its internal SVG ref if we add it there.
  // Or, we can pass sectionRef to AnimatedCartridge if it needs to be aware of the section's scroll.
  // Let's keep it simple: the AnimatedCartridge will just render.
  // The scroll trigger for the SVG itself was tied to its own ref, which is now internal to AnimatedCartridge.
  // We might need a new scroll trigger here if we want to animate the *entry* of the AnimatedCartridge component as a whole.
  // For now, let's assume the AnimatedCartridge component itself doesn't have an entry animation tied to Section2 scroll.

  const handleCartridgeClick = () => {
    setIsExploded(prev => !prev);
  };

  return (
    <Section id="ammunition" className="bg-secondary/5 relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Ammunition Components</h2>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          Explore the key components of a firearm cartridge. Click a hotspot for details, or click the cartridge body for an exploded view.
        </p>
        
        <div className="relative w-full max-w-3xl mx-auto aspect-[3/2] my-12">
          {/* Render the AnimatedCartridge component */}
          <AnimatedCartridge
            isExploded={isExploded}
            onClick={handleCartridgeClick}
            hotspotsContainerRef={hotspotsContainerRef}
          />
          
          {/* Hotspots Container - Clicks here should not propagate to the SVG */}
          <div
            ref={hotspotsContainerRef}
            className="absolute inset-0"
            onClick={(e) => e.stopPropagation()} // Prevents click from reaching SVG
            style={{ pointerEvents: isExploded ? 'none' : 'all' }} // Hotspots only clickable when not exploded
          >
            <Hotspot
              x={50} // Centered for vertical cartridge
              y={85} // Lower part for primer
              label="Primer"
              color="#0066cc"
              pulseColor="rgba(0, 102, 204, 0.3)"
              content={
                <div>
                  <p>The primer contains compounds like lead styphnate, barium nitrate, and antimony sulfide. When struck by the firing pin, it creates a small explosion that ignites the propellant.</p>
                  <p className="mt-2 font-semibold">Key GSR Components:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Lead (Pb)</li>
                    <li>Barium (Ba)</li>
                    <li>Antimony (Sb)</li>
                  </ul>
                </div>
              }
            />
            
            <Hotspot
              x={50} // Centered
              y={60} // Mid-section for propellant
              label="Propellant"
              color="#cc3300"
              pulseColor="rgba(204, 51, 0, 0.3)"
              content={
                <div>
                  <p>Modern smokeless powder contains nitrocellulose and sometimes nitroglycerin. When ignited, it rapidly burns to create expanding gases that propel the bullet.</p>
                  <p className="mt-2 font-semibold">Key GSR Components:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Nitrates</li>
                    <li>Carbon particles</li>
                  </ul>
                </div>
              }
            />
            
            <Hotspot
              x={50} // Centered
              y={20} // Top section for bullet
              label="Bullet"
              color="#339933"
              pulseColor="rgba(51, 153, 51, 0.3)"
              content={
                <div>
                  <p>Typically made of lead with a copper or copper-alloy jacket. The bullet is the projectile that exits the barrel.</p>
                  <p className="mt-2 font-semibold">Key GSR Components:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Lead (Pb)</li>
                    <li>Copper (Cu)</li>
                    <li>Zinc (Zn) - in brass jackets</li>
                  </ul>
                </div>
              }
            />
            
            <Hotspot
              x={30} // To the left of the case
              y={50} // Mid-height of the case
              label="Cartridge Case"
              color="#9933cc"
              pulseColor="rgba(153, 51, 204, 0.3)"
              content={
                <div>
                  <p>Usually made of brass (copper and zinc alloy). It contains the primer, propellant, and holds the bullet in place.</p>
                  <p className="mt-2 font-semibold">Key GSR Components:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Copper (Cu)</li>
                    <li>Zinc (Zn)</li>
                  </ul>
                </div>
              }
            />
          </div>
        </div>
        
        <div className="text-center mt-8 mb-4 max-w-3xl mx-auto">
          <p className="text-lg">Click on the hotspots to learn about each component and its contribution to GSR particles. Click the cartridge itself for an exploded view.</p>
          <p className="mt-4 text-sm text-muted-foreground">During discharge, these components undergo rapid chemical and physical changes under extreme heat and pressure.</p>
        </div>
      </div>
    </Section>
  );
};

export default Section2_Ammunition;