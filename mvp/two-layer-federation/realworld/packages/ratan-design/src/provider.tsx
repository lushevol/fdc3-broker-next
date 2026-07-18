import { ThemeProvider, createTheme } from '@mui/material';
import { useMemo, type PropsWithChildren } from 'react';
import './generated/tokens.css';
import {
  semanticTokens,
  type DesignDensity,
  type DesignScheme,
} from './foundation/tokens';

export interface DesignAppearance {
  readonly scheme: DesignScheme;
  readonly density: DesignDensity;
  readonly direction: 'ltr' | 'rtl';
}

export type DesignScope = 'host' | 'application' | 'standalone' | 'storybook';

export function createRatanTheme(appearance: DesignAppearance) {
  const colors = semanticTokens.color[appearance.scheme];
  const compact = appearance.density === 'compact';
  return createTheme({
    direction: appearance.direction,
    palette: {
      mode: appearance.scheme,
      primary: { main: colors.actionPrimary },
      error: { main: colors.actionDanger },
      background: { default: colors.surfaceDefault, paper: colors.surfaceRaised },
      text: { primary: colors.contentPrimary, secondary: colors.contentSecondary },
      divider: colors.borderSubtle,
    },
    typography: {
      fontFamily: semanticTokens.foundation.fontFamily,
      fontSize: compact ? 12 : 14,
      button: { textTransform: 'none', fontWeight: Number(semanticTokens.foundation.fontWeightStrong) },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { size: compact ? 'small' : 'medium', disableElevation: true },
      },
      MuiTextField: {
        defaultProps: { size: compact ? 'small' : 'medium' },
      },
    },
  });
}

export interface DesignSystemProviderProps extends PropsWithChildren {
  readonly appearance: DesignAppearance;
  readonly scope?: DesignScope;
}

export function DesignSystemProvider({
  appearance,
  scope = 'application',
  children,
}: DesignSystemProviderProps) {
  const theme = useMemo(
    () => createRatanTheme(appearance),
    [appearance.density, appearance.direction, appearance.scheme],
  );
  return (
    <ThemeProvider theme={theme}>
      <div
        className="ratan-design-root"
        data-ratan-scope={scope}
        data-ratan-theme={appearance.scheme}
        data-ratan-density={appearance.density}
        dir={appearance.direction}
      >
        {children}
      </div>
    </ThemeProvider>
  );
}
