/**
 * GDS Design Tokens - Sizes
 * Generated from Figma Design System
 */

export const componentSizes = {
  // Pixel values
  '1px': 1,
  '2px': 2,
  '3px': 3,
  '4px': 4,
  '5px': 5,
  '6px': 6,
  '7px': 7,
  '8px': 8,
  '9px': 9,
  '10px': 10,
  '12px': 12,
  '14px': 14,
  '16px': 16,
  '18px': 18,
  '19px': 19,
  '20px': 20,
  '22px': 22,
  '24px': 24,
  '26px': 26,
  '28px': 28,
  '30px': 30,
  '32px': 32,
  '34px': 34,
  '36px': 36,
  '38px': 38,
  '40px': 40,
  '42px': 42,
  '44px': 44,
  '48px': 48,
  '52px': 52,
  '54px': 54,
  '56px': 56,
  '60px': 60,
  '64px': 64,
  '72px': 72,
  '80px': 80,
  '96px': 96,
  '104px': 104,
  '120px': 120,
  '144px': 144,
  '256px': 256,
  '260px': 260,
  '272px': 272,
  '296px': 296,
  '512px': 512,
};

export const componentSpacing = {
  '2px': 1,
  '4px': 2,
  '8px': 4,
  '12px': 6,
  '16px': 8,
  '20px': 10,
  '24px': 12,
  '32px': 16,
};

export const componentRound = {
  '4px': 4,
  '6px': 6,
  'round-theme': 6,
  pill: 32,
};

export const iconSizes = {
  '12px': 12,
  '16px': 16,
};

export const sizeTokens = {
  ...componentSizes,
  ...componentSpacing,
  ...componentRound,
  ...iconSizes,
};

// Semantic size tokens
export const semanticSizes = {
  // Input field
  input: {
    minHeight: 22,
    horizPadding: 12,
    vertPadding: 5,
  },
  // Button
  button: {
    horizPaddingText: 4,
    vertPaddingText: 1,
    minTextButtonHeight: 24,
    padButtonToggle: 2,
  },
  // Card
  card: {
    horizPadding: 6,
    vertPadding: 6,
  },
  // Tab/Status
  tab: {
    horizPadding: 16,
    vertPadding: 16,
    surfaceSelectedLayered: '#ffffff',
  },
};
