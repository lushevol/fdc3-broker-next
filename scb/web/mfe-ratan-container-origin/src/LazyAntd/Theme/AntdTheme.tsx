import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import ConfigProvider from "antd/lib/config-provider";
import theme from "antd/lib/theme";
import { ContainerProvider } from "../../Root/import";
const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';
const AntdTheme: React.FC<PropsWithChildren> = ({ children }): ReactElement => {
  const [ContainerStore] = ContainerProvider.useContext();
  const antdTheme = useMemo(() => {
    const themeAlgo =
      ContainerStore.theme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm;
    const colorPrimary =
      ContainerStore.theme === "dark" ? "#2f82ff" : "#2196f3";
    return {
      theme: {
        algorithm: themeAlgo,
        token: {
          fontSize: defaultFontSize,
          fontFamily: defaultFontFamily,
          zIndexPopupBase: 1400,
          colorTextDisabled: "var(--theme-color-form-item-disabled-font)",
          colorPrimary: colorPrimary,
        },
      },
    };
  }, [ContainerStore.theme]);
  return <ConfigProvider {...antdTheme}>{children}</ConfigProvider>;
};
export default AntdTheme;
