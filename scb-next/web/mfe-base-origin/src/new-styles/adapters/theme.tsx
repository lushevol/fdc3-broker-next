import React, { ReactElement } from 'react';
import { Config } from 'ratan-design-origin/portal-theme';
import { useContext } from '../../hooks/provider';
import { ComponentPropsDefault } from '../../hooks/model/root';
import ThemeProvider from '../../theme/Provider';
import { createPortalPresentationTheme } from '../theme';
import { resolvePortalAppearance } from '../appearance';
import { getTheme, getThemeClassName } from '../theme-selection';

export { getThemeClassName } from '../theme-selection';

const Theme: React.FC<ComponentPropsDefault> = (props): ReactElement => {
  const [store] = useContext();
  const theme = React.useMemo(() => {
    const prototype =
      resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
    let themeConfig = store.theme ?? 'light';
    if (!store?.user?.id || !store.token) {
      themeConfig = prototype ? (store.loginAppearance ?? 'light') : 'dark';
    }
    const config = prototype
      ? createPortalPresentationTheme(themeConfig === 'light' ? 'light' : 'dark')
      : Config(getTheme(themeConfig, store.newStyles)).config;
    document.documentElement.className = getThemeClassName(themeConfig, store.newStyles);
    if (store.newStyles) {
      document.documentElement.classList.add('ratan-design-root');
      document.documentElement.dataset.generation = 'webkit';
      document.documentElement.dataset.mode = config.palette.mode;
    } else {
      delete document.documentElement.dataset.generation;
      delete document.documentElement.dataset.mode;
    }
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token, store.newStyles, store.loginAppearance]);
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
