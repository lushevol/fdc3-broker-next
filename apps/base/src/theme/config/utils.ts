import getDarkTheme from './dark';
import getLightTheme from './light';

export enum THEME {
  DARK = 'dark',
  LIGHT = 'light',
  GOLD = 'gold',
}

export const getTheme = (theme: string | undefined) => {
  switch (theme) {
    case THEME.DARK:
      return getDarkTheme();
    case THEME.LIGHT:
      return getLightTheme();
    case THEME.GOLD:
      return getDarkTheme();
    default:
      return getLightTheme();
  }
};
