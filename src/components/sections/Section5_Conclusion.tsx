"use client";

import * as React from 'react';
import { useEffect, useRef, useState } from 'react'; // Import useState
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../shared/Section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Register the ScrollTrigger plugin only on the client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Section5_Conclusion: React.FC = () => {
  // Define a type for particle style
  type ParticleStyle = {
    width: string;
    height: string;
    left: string;
    top: string;
    opacity: number;
    boxShadow: string;
  };

  // State for particles
  const [particles, setParticles] = useState<ParticleStyle[]>([]);

  // Refs for animation targets
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  
  // Set up scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !contentRef.current || !signatureRef.current || !linksRef.current) return;
    
    // Create a timeline for the animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });
    
    // Animate the title
    tl.from(titleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Animate the content sections with staggered effect
    tl.from(contentRef.current.children, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.4');
    
    // Animate the signature
    tl.from(signatureRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.2');
    
    // Animate the links
    tl.from(linksRef.current.children, {
      y: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3');
    
    // Clean up
    return () => {
      tl.kill();
    };
  }, []);
  
  // Create a "zoom out" effect for the final section
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const zoomTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 0%',
        scrub: true,
      }
    });
    
    // Subtle zoom out effect as user scrolls through the section
    zoomTl.to(sectionRef.current, {
      scale: 0.95,
      opacity: 0.9,
      duration: 1,
      ease: 'none'
    });
    
    return () => {
      zoomTl.kill();
    };
  }, []);

  // Generate particle styles on client mount
  useEffect(() => {
    const generatedParticles: ParticleStyle[] = Array.from({ length: 50 }).map(() => ({
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.2,
      boxShadow: `0 0 ${Math.random() * 3 + 1}px rgba(255,255,255,0.7)`
    }));
    setParticles(generatedParticles);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Section id="conclusion" className="bg-black/80 relative overflow-hidden">
      {/* Background particle effect - subtle, static particles */}
      <div className="absolute inset-0 opacity-20">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={style}
          />
        ))}
      </div>
      
      <div ref={sectionRef} className="max-w-4xl mx-auto w-full relative z-10">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-8 text-center">
          The Evidence Trail: <span className="text-primary">Significance & Conclusion</span>
        </h2>
        
        <div ref={contentRef} className="space-y-6 mb-10">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-primary/90">The Chemical Signature</h3>
            <p className="text-lg">
              GSR particles have a distinctive chemical composition that makes them valuable forensic evidence. 
              The combination of lead, barium, and antimony in a single particle is characteristic of firearms discharge.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-primary/90">Collection & Analysis</h3>
            <p className="text-lg">
              Forensic scientists collect GSR using adhesive stubs on surfaces like hands, clothing, and nearby objects. 
              Analysis is typically performed using Scanning Electron Microscopy with Energy Dispersive X-ray Spectroscopy (SEM-EDX), 
              which can identify the elemental composition of individual particles.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-primary/90">Key Takeaways</h3>
            <ul className="text-lg space-y-2 list-disc pl-6">
              <li>GSR particles form through rapid vaporization and condensation of primer and cartridge materials</li>
              <li>The characteristic spherical shape results from molten material cooling in air</li>
              <li>Particles disperse in a cloud and deposit on nearby surfaces</li>
              <li>The presence of lead, barium, and antimony in a single particle is forensically significant</li>
              <li>Modern ammunition may produce particles with different compositions (lead-free primers)</li>
            </ul>
          </div>
        </div>
        
        {/* Chemical signature visualization */}
        <div 
          ref={signatureRef}
          className="w-full max-w-md mx-auto p-4 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-blue-900/30 rounded-xl mb-10 border border-white/20"
        >
          <div className="text-center mb-3 text-lg font-semibold">Typical GSR Particle Composition</div>
          <div className="flex justify-center gap-6 items-center">
            {/* Lead */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-400 mx-auto flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-gray-400/30">
                Pb
              </div>
              <div className="mt-2 text-sm">Lead</div>
            </div>
            
            {/* Barium */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-300 mx-auto flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-green-300/30">
                Ba
              </div>
              <div className="mt-2 text-sm">Barium</div>
            </div>
            
            {/* Antimony */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-300 mx-auto flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-blue-300/30">
                Sb
              </div>
              <div className="mt-2 text-sm">Antimony</div>
            </div>
          </div>
        </div>
        
        {/* Links and further reading */}
        <div ref={linksRef} className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild variant="default" size="lg" className="shadow-lg shadow-primary/20">
            <Link href="#introduction">Back to Start</Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="shadow-lg">
            <Link href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6515237/" target="_blank" rel="noopener noreferrer">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Section5_Conclusion;
          
 