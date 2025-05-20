import React from 'react';

interface PhaseTextProps {
  animationPhase: number;
}

const PhaseText: React.FC<PhaseTextProps> = ({ animationPhase }) => {
  switch(animationPhase) {
    case 0:
      return (
        <>
          <h3 className="text-2xl font-semibold mb-2">Particle Dispersion & Deposition</h3>
          <p>GSR (Gunshot Residue) particles form when a firearm is discharged. This animation demonstrates how these particles disperse and settle on surfaces.</p>
          <p className="mt-2 text-sm text-muted-foreground">Use the phase buttons above to control the animation or continue scrolling.</p>
        </>
      );
    case 1:
      return (
        <>
          <h3 className="text-2xl font-semibold mb-2">Initial Discharge</h3>
          <p>When a firearm is discharged, the primer and propellant create a high-pressure, high-temperature environment that vaporizes metals.</p>
          <p className="mt-2">This creates a cloud of microscopic particles containing:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Lead (from the primer and bullet)</li>
            <li>Barium and antimony (from the primer)</li>
            <li>Copper and zinc (from the cartridge case)</li>
          </ul>
        </>
      );
    case 2:
      return (
        <>
          <h3 className="text-2xl font-semibold mb-2">Cloud Dispersion</h3>
          <p>The GSR particle cloud expands rapidly in all directions, following fluid dynamics principles and air currents.</p>
          <p className="mt-2">Dispersion is affected by:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Firearm type and caliber</li>
            <li>Environmental conditions (wind, humidity)</li>
            <li>Enclosed vs. open spaces</li>
            <li>Distance from the discharge point</li>
          </ul>
        </>
      );
    case 3:
      return (
        <>
          <h3 className="text-2xl font-semibold mb-2">Particle Deposition</h3>
          <p>As energy dissipates, GSR particles begin to settle on nearby surfaces due to gravity and electrostatic attraction.</p>
          <p className="mt-2">Deposition patterns show:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Highest concentration near the discharge point</li>
            <li>Significant deposits on the shooter&rsquo;s hands</li>
            <li>Decreasing concentration with distance</li>
            <li>Particles can travel up to 3-5 feet from the source</li>
          </ul>
        </>
      );
    case 4:
      return (
        <>
          <h3 className="text-2xl font-semibold mb-2">Forensic Analysis</h3>
          <p>GSR patterns provide critical forensic evidence in shooting investigations.</p>
          <p className="mt-2">Forensic scientists can determine:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Approximate firing distance</li>
            <li>Shooter identification (hand residue)</li>
            <li>Firearm type and ammunition</li>
            <li>Time since discharge (particle degradation)</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">The highest concentration of GSR is typically found in the web between the thumb and index finger of the shooter&rsquo;s hand.</p>
        </>
      );
    default:
      return null;
  }
};

export default PhaseText;