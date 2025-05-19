// colors.ts - GSR particle colors with scientific meaning

// GSR particle colors with scientific meaning - refined for visual realism
export const particleColors = {
  lead: ['#71797E', '#7D8491', '#646464'],      // Silver/Lead variations - Primary GSR component
  barium: ['#8f8f8f', '#A8A8A8', '#7A7A7A'],    // Light gray variations - Barium compounds
  antimony: ['#555555', '#666666', '#444444'],  // Dark gray variations - Antimony compounds
  copper: ['#b87333', '#C28248', '#A66321'],    // Copper variations from bullet jacket
  brass: ['#d4af37', '#E5C158', '#C09C20'],     // Gold/brass variations from cartridge case
  carbon: ['#222222', '#333333', '#111111'],    // Carbon residue from propellant
};

// Export color array for other components to use
export const particleColorsArray = Object.values(particleColors).flat();