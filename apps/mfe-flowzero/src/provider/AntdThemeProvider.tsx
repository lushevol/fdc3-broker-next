import { ConfigProvider, theme } from "antd";
import React, { FC, PropsWithChildren, useMemo } from "react";

const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';

const AntdThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const antdTheme = useMemo(() => {
    const themeAlgo = theme.defaultAlgorithm;
    return {
      theme: {
        algorithm: themeAlgo,
        token: {
          fontSize: defaultFontSize,
          fontFamily: defaultFontFamily,
          zIndexPopupBase: 1500,
        },
        components: {
          Layout: {
            headerBg: "#012E5D",
            headerPadding: "0 1rem",
            siderBg: "#012E5D",
          },
          Menu: {
            darkItemBg: "#012E5D",
            itemPaddingInline: 0,
          },
        },
      },
    };
  }, []);
  return <ConfigProvider {...antdTheme}>{children}</ConfigProvider>;
};

export default AntdThemeProvider;
