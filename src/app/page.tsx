"use client";

import { useEffect } from "react";
import Layout from "../components/shared/Layout";
import ScrollSnapContainer from "../components/shared/ScrollSnapContainer";
import Section from "../components/shared/Section";
import Section1_Introduction from "../components/sections/Section1_Introduction";
import Section2_Ammunition from "../components/sections/Section2_Ammunition";
import Section3_Discharge from "../components/sections/Section3_Discharge";

export default function Home() {
  // Set to true to enable debug mode for development
  const debugMode = true;
  
  // Add an effect to ensure all sections are visible on load
  useEffect(() => {
    // Force all sections to be visible
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
      section.classList.remove('hidden');
      section.classList.remove('fade-out');
    });
  }, []);
  
  return (
    <Layout debug={debugMode}>
      <ScrollSnapContainer debug={debugMode}>
        {/* Introduction Section */}
        <Section1_Introduction />
        
        {/* Ammunition Section */}
        <Section2_Ammunition />
        
        {/* Discharge Section */}
        <Section3_Discharge />
        
        {/* Dispersion Section */}
        <Section id="dispersion" className="bg-secondary/10">
          <h2 className="text-3xl font-bold mb-4">Particle Dispersion</h2>
          <p className="text-lg">How GSR particles disperse after discharge</p>
        </Section>
        
        {/* Conclusion Section */}
        <Section id="conclusion" className="bg-primary/5">
          <h2 className="text-3xl font-bold mb-4">Conclusion</h2>
          <p className="text-lg">Summary and key takeaways</p>
        </Section>
      </ScrollSnapContainer>
    </Layout>
  );
}
