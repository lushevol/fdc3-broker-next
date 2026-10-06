import { getPortalTheme } from 'ratan-design-origin/portal-theme';

export enum THEME {
  DARK = 'dark',
  LIGHT = 'light',
  GOLD = 'gold',
}

export const getTheme = (theme: string | undefined, newStyles = false) =>
  getPortalTheme(
    theme,
    newStyles,
    new URLSearchParams(window.location.search).get('new-layout') === 'true',
  );

export const getThemeClassName = (theme: string, newStyles = false): string => {
  const mode = theme === 'light' ? 'light' : 'dark';
  return newStyles ? `${mode} sc-mode-${mode}` : mode;
};
