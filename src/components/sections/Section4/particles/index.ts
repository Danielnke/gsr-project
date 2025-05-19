// particles/index.ts - Export all particle configurations

// Import all configurations
import { particleColors, particleColorsArray } from './colors';
import { baseParticleConfig } from './baseConfig';
import { getPhase0Config } from './phase0';
import { getPhase1Config } from './phase1';
import { getPhase2Config } from './phase2';
import { getPhase3Config } from './phase3';
import { getPhase4Config } from './phase4';

// Re-export all configurations
export { particleColors, particleColorsArray };
export { baseParticleConfig };
export { getPhase0Config };
export { getPhase1Config };
export { getPhase2Config };
export { getPhase3Config };
export { getPhase4Config };

// Main function to get particle configuration based on animation phase
export const getParticleConfig = (animationPhase: number) => {
  // Modify configuration based on animation phase
  switch(animationPhase) {
    case 0:
      return getPhase0Config();
    case 1:
      return getPhase1Config();
    case 2:
      return getPhase2Config();
    case 3:
      return getPhase3Config();
    case 4:
      return getPhase4Config();
    default:
      return getPhase0Config();
  }
};