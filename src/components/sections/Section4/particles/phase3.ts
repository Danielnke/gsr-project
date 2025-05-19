// phase3.ts - Deposition configuration (particles start to settle on surfaces)

import { baseParticleConfig } from './baseConfig';

// Deposition - particles start to settle on surfaces
export const getPhase3Config = () => {
  return {
    ...baseParticleConfig,
    particles: {
      ...baseParticleConfig.particles,
      number: {
        value: 220,
        density: {
          enable: true,
          area: 800,
        },
      },
      opacity: {
        value: { min: 0.6, max: 0.8 },
        animation: {
          enable: true,
          speed: 0.2,
          minimumValue: 0.4,
          sync: false,
        },
      },
      move: {
        ...baseParticleConfig.particles.move,
        speed: 0.8,
        direction: "bottom" as const, // Particles moving downward
        straight: false,
        gravity: {
          enable: true,
          acceleration: 0.15, // Gentler gravity for more realistic settling
        },
        outModes: {
          default: "destroy" as const,
          bottom: "none" as const,
          top: "none" as const,
        },
        trail: {
          enable: true,
          length: 10,
          fillColor: "#000000",
        },
        path: {
          enable: false,
        },
        attract: {
          enable: false,
        },
      },
      wobble: {
        distance: 5, // Less wobble during deposition
        enable: true,
        speed: {
          min: 2,
          max: 5,
        },
      },
    },
    emitters: [
      // Top left emitter
      {
        direction: "bottom" as const,
        rate: {
          delay: 0.1,
          quantity: 2,
        },
        position: {
          x: 20,
          y: 20,
        },
        size: {
          width: 30,
          height: 0,
        },
        life: {
          duration: 0.5,
          count: 1,
        },
      },
      // Top right emitter
      {
        direction: "bottom" as const,
        rate: {
          delay: 0.1,
          quantity: 2,
        },
        position: {
          x: 80,
          y: 20,
        },
        size: {
          width: 30,
          height: 0,
        },
        life: {
          duration: 0.5,
          count: 1,
        },
      },
      // Center emitter
      {
        direction: "bottom" as const,
        rate: {
          delay: 0.1,
          quantity: 3,
        },
        position: {
          x: 50,
          y: 30,
        },
        size: {
          width: 40,
          height: 0,
        },
        life: {
          duration: 0.5,
          count: 1,
        },
      },
    ],
  };
};