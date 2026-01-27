import dark from './dark';
import light from './light';

export enum THEME {
  DARK = 'dark',
  LIGHT = 'light',
  GOLD = 'gold',
}

export const getTheme = (theme: string | undefined) => {
  switch (theme) {
    case THEME.DARK:
      return dark;
    case THEME.LIGHT:
      return light;
    case THEME.GOLD:
      return dark;
    default:
      return light;
  }
};
