import React, { ReactElement } from "react";
import Config from "./Config";
import { useContext } from "../hooks/provider";
import { ComponentPropsDefault } from "../hooks/model/root";
import { getTheme } from "./config/utils";
import ThemeProvider from "./Provider";

export const getThemeClassName = (
  theme: string,
  newStyles = false
): string => {
  const mode = theme === "light" ? "light" : "dark";
  return newStyles ? `${mode} sc-mode-${mode}` : mode;
};

const Theme: React.FC<ComponentPropsDefault> = (props): ReactElement => {
  const [store] = useContext();
  const theme = React.useMemo(() => {
    let themeConfig = store.theme ?? "light";
    if (!store?.user?.id || !store.token) {
      themeConfig = "dark";
    }
    const { config } = Config(getTheme(themeConfig, store.newStyles));
    document.documentElement.className = getThemeClassName(
      themeConfig,
      store.newStyles
    );
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token, store.newStyles]);
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
