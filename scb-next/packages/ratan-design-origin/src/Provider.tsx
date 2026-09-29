import React from 'react';
import { createTheme, styled, ThemeProvider, type Theme } from '@mui/material/styles';
import {
  DEFAULT_RATAN_APPEARANCE,
  resolveRatanAppearance,
  type RatanAppearance,
} from './appearance.js';
import { createRatanTheme, type RatanThemeOptions } from './theme/index.js';
export const OverlayContainerContext = /*#__PURE__*/ React.createContext<
  HTMLElement | null | undefined
>(undefined);
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
): Theme {
  return createTheme(baseTheme, {
    palette: { mode: appearance.mode },
    ratan: { designGeneration: appearance.designGeneration },
  });
}

/** Clone only portal defaults; attaching a root must not rebuild the theme. */
function withPortalContainer(theme: Theme, container?: HTMLElement): Theme {
  return {
    ...theme,
    components: {
      ...theme.components,
      MuiMenu: {
        ...theme.components?.MuiMenu,
        defaultProps: { ...theme.components?.MuiMenu?.defaultProps, container },
      },
      MuiPopover: {
        ...theme.components?.MuiPopover,
        defaultProps: { ...theme.components?.MuiPopover?.defaultProps, container },
      },
      MuiDialog: {
        ...theme.components?.MuiDialog,
        defaultProps: { ...theme.components?.MuiDialog?.defaultProps, container },
      },
      MuiModal: {
        ...theme.components?.MuiModal,
        defaultProps: { ...theme.components?.MuiModal?.defaultProps, container },
      },
      MuiPopper: {
        ...theme.components?.MuiPopper,
        defaultProps: { ...theme.components?.MuiPopper?.defaultProps, container },
      },
    },
  };
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
  const appearanceTheme = React.useMemo(
    () => baseTheme
      ? createScopedHostTheme(baseTheme, appearance)
      : createRatanTheme(appearance),
    [appearance, baseTheme],
  );
  const theme = React.useMemo(
    () => withPortalContainer(appearanceTheme, root ?? undefined),
    [appearanceTheme, root],
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
