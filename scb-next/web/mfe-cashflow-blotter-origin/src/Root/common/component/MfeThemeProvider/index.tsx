import { ConfigProvider, message, theme } from 'antd';
import { ConfigProviderProps } from 'antd/es/config-provider';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import {
  RatanDesignProvider,
  resolveRatanAppearance,
  useRatanAppearance,
  type RatanAppearanceInput,
} from 'ratan-design-origin';

import { ContainerProvider, ThemeConfig, ThemeUtil } from '../../../import';

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins", Helvetica !important';

interface MfeThemeProviderProps extends PropsWithChildren {
  appearance?: RatanAppearanceInput;
}

const MfeThemeProvider: FC<MfeThemeProviderProps> = (props) => {
  const [ContainerStore] = ContainerProvider.useContext();
  const inheritedAppearance = useRatanAppearance();
  const appearance = resolveRatanAppearance(props.appearance, {
    mode: ContainerStore.theme === 'dark' ? 'dark' : 'light',
    designGeneration: ContainerStore.designGeneration ?? inheritedAppearance.designGeneration,
  });
  useEffect(() => {
    message.config({
      top: 80,
    });
  }, []);
  const muiTheme = useMemo(() => {
    const { config } = ThemeConfig(ThemeUtil.getTheme(appearance.mode));
    return config;
  }, [appearance.mode]);

  const antdTheme = useMemo<ConfigProviderProps>(() => {
    const themeAlgo = appearance.mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;
    return {
      theme: {
        algorithm: themeAlgo,
        token: {
          fontSize: defaultFontSize,
          fontFamily: defaultFontFamily,
          zIndexPopupBase: 1500,
        },
        components: {
          Message: {
            zIndexPopup: 1500,
          },
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
      <ConfigProvider {...antdTheme}>{props.children}</ConfigProvider>
    </RatanDesignProvider>
  );
};

export default MfeThemeProvider;
