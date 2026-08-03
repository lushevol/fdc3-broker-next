import { CssBaseline, ThemeProvider } from "@mui/material";
import { ConfigProvider, message, theme } from "antd";
import { ConfigProviderProps } from "antd/es/config-provider";
import { FC, PropsWithChildren, useEffect, useMemo } from "react";

import { ContainerProvider, ThemeConfig, ThemeUtil } from "../../../import";

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins", Helvetica !important';

const MfeThemeProvider: FC<PropsWithChildren> = (props) => {
  const [ContainerStore] = ContainerProvider.useContext();
  useEffect(() => {
    message.config({
      top: 80,
    });
  }, []);
  const muiTheme = useMemo(() => {
    const { config } = ThemeConfig(ThemeUtil.getTheme(ContainerStore.theme));
    return config;
  }, [ContainerStore.theme]);

  const antdTheme = useMemo<ConfigProviderProps>(() => {
    const themeAlgo =
      ContainerStore.theme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm;
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
  }, [ContainerStore.theme]);
  return (
    <ThemeProvider theme={muiTheme}>
      <ConfigProvider {...antdTheme}>{props.children}</ConfigProvider>
    </ThemeProvider>
  );
};

export default MfeThemeProvider;
