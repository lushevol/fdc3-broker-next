import React, { type ReactElement } from 'react';
import type { ComponentPropsDefault } from '../../hooks/model/root';
import { useContext } from '../../hooks/provider';
import Config from '../../theme/Config';
import ThemeProvider from '../../theme/Provider';
import { getNewLayoutTheme } from './config';

const NewLayoutTheme: React.FC<ComponentPropsDefault> = ({ children }): ReactElement => {
  const [store] = useContext();
  const theme = React.useMemo(() => {
    let themeConfig = store.theme ?? 'light';
    if (!store.user?.id || !store.token) themeConfig = 'dark';

    const { config } = Config(getNewLayoutTheme(themeConfig));
    document.documentElement.className = themeConfig;
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default NewLayoutTheme;
