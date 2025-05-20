"use client";

import { useEffect } from "react";
import Layout from "../components/shared/Layout";
import ScrollSnapContainer from "../components/shared/ScrollSnapContainer";
import Section1_Introduction from "../components/sections/Section1_Introduction";
import Section2_Ammunition from "../components/sections/Section2_Ammunition";
import Section3_Discharge from "../components/sections/Section3";
import Section4_Dispersion from "../components/sections/Section4";
import Section5_Conclusion from "../components/sections/Section5_Conclusion";

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
        <Section4_Dispersion />
        
        {/* Conclusion Section */}
        <Section5_Conclusion />
      </ScrollSnapContainer>
    </Layout>
  );
}
