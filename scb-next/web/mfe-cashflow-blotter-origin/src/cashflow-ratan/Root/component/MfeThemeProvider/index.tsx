import { FC, PropsWithChildren, useMemo, useEffect } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import { ThemeConfig, ThemeUtil } from '../../import';
import { CssBaseline } from '@mui/material';
import { createTheme, darken } from '@mui/material/styles';
import { RatanDesignProvider, useRatanAppearance } from 'ratan-design-origin';
import { createRatanTheme } from 'ratan-design-origin/theme';

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';

const MfeThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const appearance = useRatanAppearance();
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
    return {
      theme: {
        algorithm: themeAlgo,
        token: {
          fontSize: defaultFontSize,
          fontFamily: defaultFontFamily,
          zIndexPopupBase: 1500,
          colorBgSpotlight: 'var(--theme-color-antd-tooltip-bg)',
        },
      },
    };
  }, [appearance.mode]);
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
