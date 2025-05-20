"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Section from '../shared/Section';
import Hotspot from '../shared/Hotspot';

const Section2_Ammunition: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const currentSection = sectionRef.current;
    const currentSvg = svgRef.current;
    let tl: gsap.core.Timeline | null = null;

    if (currentSection && currentSvg) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: currentSection,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });
      
      tl.from(currentSvg, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
    
    return () => {
      if (tl) {
        tl.kill();
      }
      // Preserve original cleanup intent for the section itself,
      // in case other tweens not managed by `tl` were applied to `currentSection`.
      if (currentSection) {
        gsap.killTweensOf(currentSection);
      }
    };
  }, []);

  return (
    <Section id="ammunition" className="bg-secondary/5 relative">
      <div ref={sectionRef} className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">Ammunition Components</h2>
        
        <p className="text-xl text-center mb-12 max-w-3xl mx-auto">
          Explore the key components of a firearm cartridge and discover the chemical elements that will form GSR particles.
        </p>
        
        <div className="relative w-full max-w-3xl mx-auto aspect-[3/2] my-12">
          {/* SVG Cartridge Diagram */}
          <svg 
            ref={svgRef}
            viewBox="0 0 800 500" 
            className="w-full h-full"
            aria-labelledby="cartridge-title cartridge-desc"
            role="img"
          >
            <title id="cartridge-title">Firearm Cartridge Diagram</title>
            <desc id="cartridge-desc">Detailed diagram of a firearm cartridge showing the primer, propellant, bullet, and case.</desc>
            
            {/* Case */}
            <path 
              d="M200,400 L200,150 L300,100 L500,100 L600,150 L600,400 L200,400 Z" 
              fill="#d4af37" 
              stroke="#000" 
              strokeWidth="2"
              className="case-part"
            />
            
            {/* Bullet */}
            <path 
              d="M600,150 L600,400 L700,400 C700,300 700,250 600,150 Z" 
              fill="#b87333" 
              stroke="#000" 
              strokeWidth="2"
              className="bullet-part"
            />
            
            {/* Propellant (stylized) */}
            <rect 
              x="220" 
              y="150" 
              width="360" 
              height="200" 
              fill="#333" 
              className="propellant-part"
            />
            
            {/* Primer */}
            <circle 
              cx="400" 
              cy="400" 
              r="40" 
              fill="#777" 
              stroke="#000" 
              strokeWidth="2"
              className="primer-part"
            />
          </svg>
          
          {/* Hotspots */}
          <Hotspot 
            x={50} 
            y={80} 
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
            x={40} 
            y={50} 
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
            x={75} 
            y={50} 
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
            x={25} 
            y={50} 
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
        
        <div className="text-center mt-8 mb-4 max-w-3xl mx-auto">
          <p className="text-lg">Click on the hotspots to learn about each component and its contribution to GSR particles.</p>
          <p className="mt-4 text-sm text-muted-foreground">During discharge, these components undergo rapid chemical and physical changes under extreme heat and pressure.</p>
        </div>
      </div>
    </Section>
  );
};

export default Section2_Ammunition;