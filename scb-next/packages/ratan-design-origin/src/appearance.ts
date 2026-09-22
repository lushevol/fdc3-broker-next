import type { PaletteMode } from '@mui/material';
import type { DesignGeneration } from './theme/index.js';

export interface RatanAppearance {
  readonly mode: PaletteMode;
  readonly designGeneration: DesignGeneration;
}

export type RatanAppearanceInput = Partial<RatanAppearance>;

export const DEFAULT_RATAN_APPEARANCE: RatanAppearance = Object.freeze({
  mode: 'light',
  designGeneration: 'legacy',
});

export function resolveRatanAppearance(
  appearance: RatanAppearanceInput = {},
  inherited: RatanAppearance = DEFAULT_RATAN_APPEARANCE,
): RatanAppearance {
  return {
    mode: appearance.mode ?? inherited.mode,
    designGeneration: appearance.designGeneration ?? inherited.designGeneration,
  };
}
