/**
 * GDS Design Tokens - Shadows/Elevations
 * Generated from Figma Design System
 */

export const shadowTokens = {
  // Base shadow (used across elevations)
  base: {
    color: '#1a1a1a4d',
    offsetX: 0,
    offsetY: 1,
    blur: 2,
    spread: 0,
  },
  // Elevated shadow (used across elevations)
  elevated: {
    color: '#1a1a1a26',
  },
};

export const elevation1 = {
  // Very Low elevation
  shadow1: {
    color: '#1a1a1a26',
    offsetX: 0,
    offsetY: 1,
    blur: 3,
    spread: 1,
  },
  ...shadowTokens.base,
};

export const elevation3 = {
  // Medium elevation
  shadow3: {
    color: '#1a1a1a26',
    offsetX: 0,
    offsetY: 4,
    blur: 8,
    spread: 3,
  },
  ...shadowTokens.base,
};

export const elevations = {
  1: {
    description: 'Very Low',
    shadows: [
      {
        color: '#1a1a1a26',
        offsetX: 0,
        offsetY: 1,
        blur: 3,
        spread: 1,
      },
      {
        color: '#1a1a1a4d',
        offsetX: 0,
        offsetY: 1,
        blur: 2,
        spread: 0,
      },
    ],
  },
  3: {
    description: 'Medium',
    shadows: [
      {
        color: '#1a1a1a26',
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 3,
      },
      {
        color: '#1a1a1a4d',
        offsetX: 0,
        offsetY: 1,
        blur: 2,
        spread: 0,
      },
    ],
  },
};

export const shadowStyles = {
  elevation1: {
    boxShadow:
      '0 1px 3px 1px rgba(26, 26, 26, 0.15), 0 1px 2px 0 rgba(26, 26, 26, 0.3)',
  },
  elevation3: {
    boxShadow:
      '0 4px 8px 3px rgba(26, 26, 26, 0.15), 0 1px 2px 0 rgba(26, 26, 26, 0.3)',
  },
};
