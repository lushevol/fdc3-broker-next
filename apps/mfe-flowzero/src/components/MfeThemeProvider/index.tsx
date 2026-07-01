import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme, darken } from "@mui/material/styles";
import { ConfigProvider, message, theme } from "antd";
import { FC, PropsWithChildren, useEffect, useMemo } from "react";
import { ContainerProvider, ThemeConfig, ThemeUtil } from "src/Root/import";

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';

const MfeThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ContainerStore] = ContainerProvider.useContext();
  useEffect(() => {
    message.config({
      top: 80,
    });
  }, []);
  const muiTheme = useMemo(() => {
    let { config } = ThemeConfig(ThemeUtil.getTheme(ContainerStore.theme));
    const bgColor = ContainerStore.theme === "dark" ? "#39a1cd" : "#EAEEF4";
    const scrollbarStyle = {
      height: "9px",
      width: "9px",
      borderRadius: "5px",
    };
    const scrollbarthumbStyle = {
      background: darken(bgColor, 0.2),
      borderRadius: "6px",
      border: "2px solid transparent",
      backgroundClip: "padding-box",
    };
    config = createTheme(config, {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              "::-webkit-scrollbar": scrollbarStyle,
              "::-webkit-scrollbar-thumb": scrollbarthumbStyle,
              "*": {
                "::-webkit-scrollbar": scrollbarStyle,
                "::-webkit-scrollbar-thumb": scrollbarthumbStyle,
              },
            },
          },
        },
      },
    });
    return config;
  }, [ContainerStore.theme]);

  const antdTheme = useMemo(() => {
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
          colorBgSpotlight: "var(--theme-color-antd-tooltip-bg)",
        },
      },
    };
  }, [ContainerStore.theme]);
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ConfigProvider {...antdTheme}>{children}</ConfigProvider>
    </ThemeProvider>
  );
};

export default MfeThemeProvider;
