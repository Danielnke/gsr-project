// phase0.ts - Initial state configuration (no particles)

import { baseParticleConfig } from './baseConfig';

// Initial state - ready to show particles
export const getPhase0Config = () => {
  return {
    ...baseParticleConfig,
    particles: {
      ...baseParticleConfig.particles,
      move: {
        ...baseParticleConfig.particles.move,
        enable: false,
      },
      number: {
        value: 0, // Start with no particles
      },
    },
  };
};