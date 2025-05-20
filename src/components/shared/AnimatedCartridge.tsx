"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedCartridgeProps {
  isExploded: boolean;
  onClick: () => void;
  hotspotsContainerRef: React.RefObject<HTMLDivElement | null>; // Allow null
}

const AnimatedCartridge: React.FC<AnimatedCartridgeProps> = ({
  isExploded, 
  onClick,
  hotspotsContainerRef 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const bulletAnnotationRef = useRef<SVGTextElement>(null);
  const caseAnnotationRef = useRef<SVGTextElement>(null);
  const primerAnnotationRef = useRef<SVGTextElement>(null);
  const propellantAnnotationRef = useRef<SVGTextElement>(null);

  const explosionTl = useRef<gsap.core.Timeline | null>(null);
  const assemblyTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const currentSvgElement = svgRef.current;
    if (!currentSvgElement) return;

    if (explosionTl.current) explosionTl.current.kill();
    if (assemblyTl.current) assemblyTl.current.kill();

    const bulletPart = currentSvgElement.querySelector('.bullet-part');
    const casePart = currentSvgElement.querySelector('.case-part');
    const primerPart = currentSvgElement.querySelector('.primer-part');
    const propellantPart = currentSvgElement.querySelector('.propellant-part');
    const allHotspots = hotspotsContainerRef.current; // Use the passed ref
    
    const anBullet = bulletAnnotationRef.current;
    const anCase = caseAnnotationRef.current;
    const anPrimer = primerAnnotationRef.current;
    const anPropellant = propellantAnnotationRef.current;

    if (!bulletPart || !casePart || !primerPart || !propellantPart || !allHotspots || !anBullet || !anCase || !anPrimer || !anPropellant) {
      return;
    }
    
    const localAnnotations = [anBullet, anCase, anPrimer, anPropellant];

    if (isExploded) {
      explosionTl.current = gsap.timeline();
      explosionTl.current
        .to(allHotspots, { opacity: 0, duration: 0.3, ease: 'power2.inOut', pointerEvents: 'none' })
        .to(bulletPart, { x: 150, duration: 0.7, ease: 'power2.out' }, 0) // Bullet moves right
        .to(casePart, { x: -100, duration: 0.7, ease: 'power2.out' }, 0)  // Case moves left
        .to(primerPart, { y: 50, duration: 0.7, ease: 'power2.out' }, 0) // Primer moves down
        .to(propellantPart, { x: -20, y: 10, scale:0.9, transformOrigin: "center center", duration: 0.7, ease: 'power2.out' }, 0) // Propellant moves slightly out and scales
        .to(localAnnotations, { opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power2.inOut' }, "-=0.3");
    } else {
      assemblyTl.current = gsap.timeline();
      assemblyTl.current
        .to(localAnnotations, { opacity: 0, duration: 0.3, ease: 'power2.inOut' })
        .to(bulletPart, { x: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(casePart, { x: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(primerPart, { y: 0, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(propellantPart, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power2.inOut' }, 0)
        .to(allHotspots, { opacity: 1, duration: 0.3, ease: 'power2.inOut', pointerEvents: 'all' }, "-=0.3");
    }
    
    return () => {
        if (explosionTl.current) explosionTl.current.kill();
        if (assemblyTl.current) assemblyTl.current.kill();
    };
  }, [isExploded, hotspotsContainerRef]);

  return (
    <svg 
      ref={svgRef}
      viewBox="0 0 800 500" 
      className="w-full h-full cursor-pointer"
      aria-labelledby="cartridge-title cartridge-desc"
      role="img"
      onClick={onClick} // Use the passed onClick handler
    >
      <title id="cartridge-title">Firearm Cartridge Diagram</title>
      <desc id="cartridge-desc">Detailed diagram of a firearm cartridge. Click hotspots for component details. Click cartridge body to toggle exploded view.</desc>
      
      {/* Case */}
      <path 
        d="M355,420 L445,420 L445,400 L440,400 L435,150 L365,150 L360,400 L355,400 Z"
        fill="#B5A642" 
        stroke="#333" 
        strokeWidth="2"
        className="case-part"
      />
      
      {/* Bullet */}
      <path 
        d="M366,160 L434,160 L434,90 Q400,30 366,90 L366,160 Z"
        fill="#B87333" 
        stroke="#333" 
        strokeWidth="2"
        className="bullet-part"
      />
      
      {/* Propellant (stylized) */}
      <rect 
        x="370"
        y="165"
        width="60"
        height="230"
        fill="#5A5A5A" 
        className="propellant-part"
        rx="5"
      />
      
      {/* Primer */}
      <circle 
        cx="400"
        cy="410"
        r="25"
        fill="#C0C0C0" 
        stroke="#333" 
        strokeWidth="2"
        className="primer-part"
      />

      {/* Annotations Group - initially hidden */}
      <g className="annotations-group" style={{ pointerEvents: 'none' }}>
        <text ref={bulletAnnotationRef} x="580" y="100" opacity="0" fill="white" fontSize="20" textAnchor="middle" className="font-sans">Bullet</text>
        <text ref={caseAnnotationRef} x="270" y="280" opacity="0" fill="white" fontSize="20" textAnchor="middle" className="font-sans">Case</text>
        <text ref={primerAnnotationRef} x="400" y="480" opacity="0" fill="white" fontSize="20" textAnchor="middle" className="font-sans">Primer</text>
        <text ref={propellantAnnotationRef} x="380" y="290" opacity="0" fill="white" fontSize="20" textAnchor="middle" className="font-sans">Propellant</text>
      </g>
    </svg>
  );
};

export default AnimatedCartridge;