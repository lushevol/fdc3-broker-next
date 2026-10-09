import type { Theme } from 'ratan-design-origin/theme';
import type { RatanAppearance } from 'ratan-design-origin';

export interface PortalStylePreview extends RatanAppearance {
  composeTheme: (baseline: Theme) => Theme;
}
