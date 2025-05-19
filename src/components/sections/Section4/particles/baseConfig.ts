// baseConfig.ts - Base configuration for GSR particles

import { particleColorsArray } from './colors';

// Base configuration for GSR particles with enhanced visual effects
export const baseParticleConfig = {
  fullScreen: false,
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: particleColorsArray, // Flatten the array of color variations
    },
    shape: {
      type: ["circle", "triangle", "square"],
    },
    opacity: {
      value: { min: 0.5, max: 0.9 },
      animation: {
        enable: true,
        speed: 0.3, // Slower animation for more natural look
        minimumValue: 0.4,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 6 }, // More realistic particle sizes
      animation: {
        enable: true,
        speed: 0.8,
        minimumValue: 0.8,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 1.5, // Slightly slower for more realistic movement
      direction: "none" as const,
      random: true,
      straight: false,
      outModes: {
        default: "out" as const,
      },
      trail: {
        enable: true,
        length: 4,
        fillColor: "#000000",
      },
      path: {
        enable: false,
        options: {
          size: 12,
          draw: false,
          increment: 0.002,
        },
      },
      attract: {
        enable: false,
        distance: 100,
        rotate: {
          x: 3000,
          y: 3000,
        },
      },
    },
    number: {
      value: 150, // More particles for better visual effect
      density: {
        enable: true,
        area: 800,
      },
    },
    life: {
      duration: {
        value: 4, // Longer life for particles
        sync: false,
      },
      count: 1,
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random" as const,
      animation: {
        enable: true,
        speed: 2,
      },
    },
    tilt: {
      direction: "random" as const,
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 2,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
    wobble: {
      distance: 10,
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  detectRetina: true,
  emitters: [], // Will be configured per phase
};