import React, { ReactElement } from 'react';
import Config from './Config';
import { useContext } from '../hooks/provider';
import { ComponentPropsDefault } from '../hooks/model/root';
import { getTheme } from './config/utils';
import ThemeProvider from './Provider';
import { createPortalPresentationTheme } from '../new-styles/theme';
import { resolvePortalAppearance } from '../new-styles/appearance';

export const getThemeClassName = (theme: string, newStyles = false): string => {
  const mode = theme === 'light' ? 'light' : 'dark';
  return newStyles ? `${mode} sc-mode-${mode}` : mode;
};

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
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token, store.newStyles, store.loginAppearance]);
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
