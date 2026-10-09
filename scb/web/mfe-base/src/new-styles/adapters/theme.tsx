import React, { ReactElement } from 'react';
import { Config } from 'ratan-design-origin/portal-theme';
import { useContext } from '../../hooks/provider';
import { ComponentPropsDefault } from '../../hooks/model/root';
import ThemeProvider from '../../theme/Provider';
import { createPortalPresentationTheme } from '../theme';
import { resolvePortalAppearance } from '../appearance';
import { getTheme, getThemeClassName } from '../theme-selection';
import type { PortalStylePreview } from '../styling-console/contract';

const DevelopmentConsole = process.env.NODE_ENV === 'development'
  ? React.lazy(() => import('../styling-console/Boundary'))
  : null;

export { getThemeClassName } from '../theme-selection';

const Theme: React.FC<ComponentPropsDefault> = (props): ReactElement => {
  const [store] = useContext();
  const [preview, setPreview] = React.useState<PortalStylePreview | null>(null);
  const theme = React.useMemo(() => {
    const prototype =
      resolvePortalAppearance(store.newStyles, window.location.search) === 'prototype';
    let themeConfig = store.theme ?? 'light';
    if (!store?.user?.id || !store.token) {
      themeConfig = prototype ? (store.loginAppearance ?? 'light') : 'dark';
    }
    if (preview) themeConfig = preview.mode;
    const baseline = prototype
      ? createPortalPresentationTheme(themeConfig === 'light' ? 'light' : 'dark')
      : Config(getTheme(themeConfig, store.newStyles)).config;
    const config = preview ? preview.composeTheme(baseline) : baseline;
    document.documentElement.className = getThemeClassName(themeConfig, store.newStyles);
    if (store.newStyles || preview) {
      document.documentElement.classList.add('ratan-design-root');
      document.documentElement.dataset.generation = preview?.designGeneration ?? 'webkit';
      document.documentElement.dataset.mode = config.palette.mode;
    } else {
      delete document.documentElement.dataset.generation;
      delete document.documentElement.dataset.mode;
    }
    document.body.style.backgroundColor = config.palette.background.default;
    return config;
  }, [store.theme, store.user, store.token, store.newStyles, store.loginAppearance, preview]);
  return (
    <ThemeProvider theme={theme}>
      {props.children}
      {DevelopmentConsole && (
        <React.Suspense fallback={null}>
          <DevelopmentConsole
            onPreviewChange={setPreview}
            designGeneration={store.newStyles ? 'webkit' : 'legacy'}
          />
        </React.Suspense>
      )}
    </ThemeProvider>
  );
};

export default Theme;
