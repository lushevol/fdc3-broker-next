/**
 * @fileoverview Theme Component
 *
 * Provides dynamic theme management for the application.
 * Automatically switches between light and dark themes based on
 * user preferences and authentication state.
 *
 * Theme logic:
 * - Uses dark theme when not logged in (login page)
 * - Uses user's preferred theme when logged in
 * - Falls back to light theme if no preference is set
 *
 * @module theme
 */

import React, { type ReactElement } from 'react';
import type { ComponentPropsDefault } from '../hooks/model/root';
import { useContext } from '../hooks/provider';
import Config from './Config';
import { getTheme } from './config/utils';
import ThemeProvider from './Provider';

/**
 * Theme Component
 *
 * Manages the application's theme based on user preferences and auth state.
 * Applies the selected theme to both the React tree and the document's CSS.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap with theme provider
 * @returns Children wrapped in MUI ThemeProvider with computed theme
 *
 * @example
 * <Theme>
 *   <App />
 * </Theme>
 */
const Theme: React.FC<ComponentPropsDefault> = (props): ReactElement => {
  const [store] = useContext();

  // Compute theme based on store state, memoized for performance
  const theme = React.useMemo(() => {
    // Default to stored theme preference, or 'light' if not set
    let themeConfig = store.theme ?? 'light';

    // Force dark theme when not authenticated (login page)
    if (!store?.user?.id || !store.token) {
      themeConfig = 'dark';
    }

    // Generate the MUI theme configuration
    const { config } = Config(getTheme(themeConfig));

    // Apply theme class to document for CSS custom properties
    document.documentElement.className = themeConfig;

    // Set body background color to match theme
    document.body.style.backgroundColor = config.palette.background.default;

    return config;
  }, [store.theme, store.user, store.token]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
