import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import ConfigProvider from "antd/lib/config-provider";
import theme from "antd/lib/theme";
import { useRatanAppearance } from 'ratan-design-origin';
import { compactControlTokens } from 'ratan-design-origin/tokens';
import { ContainerProvider } from "../../Root/import";
const defaultFontSize = 12;
const defaultFontFamily = '"Poppins",Helvetica!important';
const AntdTheme: React.FC<PropsWithChildren> = ({ children }): ReactElement => {
  const [ContainerStore] = ContainerProvider.useContext();
  const appearance = useRatanAppearance();
  const antdTheme = useMemo(() => {
    const themeAlgo =
      ContainerStore.theme === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm;
    const colorPrimary =
      ContainerStore.theme === "dark" ? "#2f82ff" : "#2196f3";
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
          zIndexPopupBase: 1400,
          colorTextDisabled: "var(--theme-color-form-item-disabled-font)",
          colorPrimary: colorPrimary,
        },
      },
    };
  }, [ContainerStore.theme, appearance.designGeneration]);
  return <ConfigProvider {...antdTheme}>{children}</ConfigProvider>;
};
export default AntdTheme;
