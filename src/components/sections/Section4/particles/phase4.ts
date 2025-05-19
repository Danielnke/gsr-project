// phase4.ts - Final state configuration (particles settled with some ambient movement)

import { baseParticleConfig } from './baseConfig';

// Final state - particles settled with some ambient movement
export const getPhase4Config = () => {
  return {
    ...baseParticleConfig,
    particles: {
      ...baseParticleConfig.particles,
      number: {
        value: 100,
      },
      opacity: {
        value: { min: 0.5, max: 0.8 },
        animation: {
          enable: false,
        },
      },
      size: {
        value: { min: 1, max: 6 },
        animation: {
          enable: false,
        },
      },
      move: {
        ...baseParticleConfig.particles.move,
        enable: true,
        speed: 0.3, // Slow ambient movement
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: {
          default: "bounce" as const,
        },
        trail: {
          enable: false,
        },
      },
    },
    emitters: [],
  };
};