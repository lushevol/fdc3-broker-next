import React from 'react';
import { createTheme, styled, ThemeProvider, type Theme } from '@mui/material/styles';
import {
  DEFAULT_RATAN_APPEARANCE,
  resolveRatanAppearance,
  type RatanAppearance,
} from './appearance.js';
import { createRatanTheme, type RatanThemeOptions } from './theme/index.js';
import { OverlayContainerContext } from './overlay-context.js';

export { OverlayContainerContext } from './overlay-context.js';

const RatanAppearanceContext =
  /*#__PURE__*/ React.createContext<RatanAppearance>(DEFAULT_RATAN_APPEARANCE);
const Root = /*#__PURE__*/ styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  colorScheme: theme.palette.mode,
}));

export interface RatanDesignProviderProps extends Omit<RatanThemeOptions, 'container'> {
  children?: React.ReactNode;
  className?: string;
  baseTheme?: Theme;
}

export function useRatanAppearance(): RatanAppearance {
  return React.useContext(RatanAppearanceContext);
}

function createScopedHostTheme(
  baseTheme: Theme,
  appearance: RatanAppearance,
  container?: HTMLElement,
): Theme {
  return createTheme(baseTheme, {
    palette: { mode: appearance.mode },
    ratan: { designGeneration: appearance.designGeneration },
    components: {
      MuiMenu: {
        ...baseTheme.components?.MuiMenu,
        defaultProps: { ...baseTheme.components?.MuiMenu?.defaultProps, container },
      },
      MuiPopover: {
        ...baseTheme.components?.MuiPopover,
        defaultProps: { ...baseTheme.components?.MuiPopover?.defaultProps, container },
      },
      MuiDialog: {
        ...baseTheme.components?.MuiDialog,
        defaultProps: { ...baseTheme.components?.MuiDialog?.defaultProps, container },
      },
      MuiModal: {
        ...baseTheme.components?.MuiModal,
        defaultProps: { ...baseTheme.components?.MuiModal?.defaultProps, container },
      },
      MuiPopper: {
        ...baseTheme.components?.MuiPopper,
        defaultProps: { ...baseTheme.components?.MuiPopper?.defaultProps, container },
      },
    },
  });
}

export function RatanDesignProvider({
  mode,
  designGeneration,
  baseTheme,
  className,
  children,
}: RatanDesignProviderProps) {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const inheritedAppearance = useRatanAppearance();
  const appearance = React.useMemo(
    () => resolveRatanAppearance({ mode, designGeneration }, inheritedAppearance),
    [mode, designGeneration, inheritedAppearance],
  );
  const theme = React.useMemo(
    () =>
      baseTheme
        ? createScopedHostTheme(baseTheme, appearance, root ?? undefined)
        : createRatanTheme({
            ...appearance,
            container: root ?? undefined,
          }),
    [appearance, baseTheme, root],
  );
  return (
    <RatanAppearanceContext.Provider value={appearance}>
      <OverlayContainerContext.Provider value={root}>
        <ThemeProvider theme={theme}>
          <Root
            ref={setRoot}
            className={['ratan-design-root', className].filter(Boolean).join(' ')}
            data-mode={appearance.mode}
            data-generation={appearance.designGeneration}
          >
            {children}
          </Root>
        </ThemeProvider>
      </OverlayContainerContext.Provider>
    </RatanAppearanceContext.Provider>
  );
}
