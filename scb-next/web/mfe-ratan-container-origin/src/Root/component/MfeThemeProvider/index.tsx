import { FC, PropsWithChildren, useMemo, useEffect } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import { ContainerProvider, ThemeConfig, ThemeUtil } from '../../import';
import { CssBaseline } from '@mui/material';
import { createTheme, darken } from '@mui/material/styles';
import {
  RatanDesignProvider,
  resolveRatanAppearance,
  useRatanAppearance,
  type RatanAppearanceInput,
} from 'ratan-design-origin';
import { createRatanTheme } from 'ratan-design-origin/theme';
import { compactControlTokens } from 'ratan-design-origin/tokens';

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';

interface MfeThemeProviderProps extends PropsWithChildren {
  appearance?: RatanAppearanceInput;
}

const MfeThemeProvider: FC<MfeThemeProviderProps> = ({ appearance: appearanceInput, children }) => {
  const [ContainerStore] = ContainerProvider.useContext();
  const inheritedAppearance = useRatanAppearance();
  const appearance = resolveRatanAppearance(appearanceInput, {
    mode: ContainerStore.theme === 'dark' ? 'dark' : 'light',
    designGeneration: ContainerStore.designGeneration ?? inheritedAppearance.designGeneration,
  });
  useEffect(() => {
    message.config({
      top: 80,
    });
  }, []);
  const muiTheme = useMemo(() => {
    let config = appearance.designGeneration === 'webkit'
      ? createRatanTheme(appearance)
      : ThemeConfig(ThemeUtil.getTheme(appearance.mode)).config;
    const bgColor = appearance.mode === 'dark' ? '#39a1cd' : '#EAEEF4';
    const scrollbarStyle = {
      height: '9px',
      width: '9px',
      borderRadius: '5px',
    };
    const scrollbarthumbStyle = {
      background: darken(bgColor, 0.2),
      borderRadius: '6px',
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
    };
    config = createTheme(config, {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              '::-webkit-scrollbar': scrollbarStyle,
              '::-webkit-scrollbar-thumb': scrollbarthumbStyle,
              '*': {
                '::-webkit-scrollbar': scrollbarStyle,
                '::-webkit-scrollbar-thumb': scrollbarthumbStyle,
              },
            },
          },
        },
      },
    });
    return config;
  }, [appearance.mode, appearance.designGeneration]);

  const antdTheme = useMemo(() => {
    const themeAlgo = appearance.mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;
    const compact = appearance.designGeneration === 'webkit' ? compactControlTokens : undefined;
    return {
      theme: {
        algorithm: themeAlgo,
        token: {
          fontSize: compact?.typography.compact ?? defaultFontSize,
          fontFamily: compact?.typography.fontFamily ?? defaultFontFamily,
          ...(compact && {
            fontSizeSM: compact.typography.compact,
            controlHeight: compact.control.medium.minHeight,
            controlHeightSM: compact.control.small.minHeight,
            controlHeightLG: compact.control.large.minHeight,
          }),
          zIndexPopupBase: 1500,
          colorBgSpotlight: 'var(--theme-color-antd-tooltip-bg)',
        },
      },
    };
  }, [appearance.mode, appearance.designGeneration]);
  return (
    <RatanDesignProvider
      baseTheme={muiTheme}
      mode={appearance.mode}
      designGeneration={appearance.designGeneration}
    >
      <CssBaseline />
      <ConfigProvider {...antdTheme}>{children}</ConfigProvider>
    </RatanDesignProvider>
  );
};

export default MfeThemeProvider;
