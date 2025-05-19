// phase1.ts - Cloud formation configuration (particles burst from a central point)

import { baseParticleConfig } from './baseConfig';

// Cloud formation - particles burst from a central point
export const getPhase1Config = () => {
  return {
    ...baseParticleConfig,
    particles: {
      ...baseParticleConfig.particles,
      number: {
        value: 100,
        density: {
          enable: true,
          area: 200, // Concentrated area
        },
      },
      opacity: {
        value: { min: 0.7, max: 1 }, // More visible in cloud phase
      },
      move: {
        ...baseParticleConfig.particles.move,
        speed: 2.5,
        direction: "none" as const,
        outModes: {
          default: "bounce" as const,
        },
        trail: {
          enable: true,
          length: 6,
          fillColor: "#000000",
        },
        path: {
          enable: false,
        },
      },
    },
    emitters: [
      {
        direction: "all" as const,
        rate: {
          delay: 0.05,
          quantity: 8,
        },
        position: {
          x: 100, // Position at the muzzle
          y: 50,
        },
        size: {
          width: 0,
          height: 0,
        },
        life: {
          duration: 0.2,
          count: 1,
        },
        particles: {
          move: {
            speed: 10, // Initial burst speed
            outModes: {
              default: "destroy" as const,
            },
          },
          opacity: {
            value: { min: 0.8, max: 1 },
          },
          size: {
            value: { min: 1, max: 5 },
          },
        },
      },
    ],
  };
};