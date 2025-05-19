// phase2.ts - Dispersion configuration (particles spread out in all directions)

import { baseParticleConfig } from './baseConfig';

// Dispersion - particles spread out in all directions
export const getPhase2Config = () => {
  return {
    ...baseParticleConfig,
    particles: {
      ...baseParticleConfig.particles,
      number: {
        value: 180,
        density: {
          enable: true,
          area: 600, // Wider area
        },
      },
      move: {
        ...baseParticleConfig.particles.move,
        speed: 2,
        direction: "none" as const,
        outModes: {
          default: "out" as const,
        },
        path: {
          enable: true,
          delay: {
            value: 0.1,
          },
          options: {
            size: 5,
            draw: false,
            increment: 0.001,
          },
        },
        attract: {
          enable: false,
        },
        gravity: {
          enable: false,
        },
        trail: {
          enable: true,
          length: 5,
          fillColor: "#000000",
        },
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: "random" as const,
        animation: {
          enable: true,
          speed: 3,
        },
      },
      wobble: {
        distance: 15,
        enable: true,
        speed: {
          min: 5,
          max: 20,
        },
      },
    },
    emitters: [
      {
        direction: "all" as const,
        rate: {
          delay: 0.1,
          quantity: 3,
        },
        position: {
          x: 50,
          y: 50,
        },
        size: {
          width: 100,
          height: 100,
        },
        life: {
          duration: 0.3,
          count: 1,
        },
        particles: {
          move: {
            speed: { min: 1, max: 3 },
          },
        },
      },
    ],
  };
};