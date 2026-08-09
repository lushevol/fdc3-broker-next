import React, { ReactElement } from "react";
import Config from "./Config";
import { useContext } from "../hooks/provider";
import { ComponentPropsDefault } from "../hooks/model/root";
import { getTheme } from "./config/utils";
import ThemeProvider from "./Provider";

const Theme: React.FC<ComponentPropsDefault> = (props): ReactElement => {
  const [store] = useContext();
  const theme = React.useMemo(() => {
    let themeConfig = store.theme ?? "light";
    if (!store?.user?.id || !store.token) {
      themeConfig = "dark";
    }
    const { config } = Config(getTheme(themeConfig));
    document.documentElement.className = themeConfig;
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token]);
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
