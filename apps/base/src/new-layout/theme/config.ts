import getDarkTheme from '../../theme/config/dark';
import getLightTheme from '../../theme/config/light';
import { THEME } from '../../theme/config/utils';

const withNewLayoutOverrides = <T extends ReturnType<typeof getLightTheme>>(theme: T): T => ({
  ...theme,
  MuiAppBar: {
    ...theme.MuiAppBar,
    styleOverrides: {
      ...theme.MuiAppBar.styleOverrides,
      root: {
        ...theme.MuiAppBar.styleOverrides.root,
        backdropFilter: 'unset',
        background: 'unset',
        backgroundImage: 'unset',
      },
    },
  },
  NewTileComponent: {
    ...theme.NewTileComponent,
    boxShadow: 'none',
    root: {
      ...theme.NewTileComponent.root,
      backgroundColor: 'none',
      background: 'unset',
      '&:hover': {
        ...theme.NewTileComponent.root['&:hover'],
        background: 'unset',
      },
    },
  },
});

export const getNewLayoutTheme = (theme: string | undefined) => {
  if (theme === THEME.DARK || theme === THEME.GOLD) {
    const dark = getDarkTheme();
    return {
      ...withNewLayoutOverrides(dark),
      MuiAppBar: {
        ...dark.MuiAppBar,
        styleOverrides: {
          ...dark.MuiAppBar.styleOverrides,
          root: {
            ...dark.MuiAppBar.styleOverrides.root,
            backdropFilter: undefined,
            background: 'transparent',
            backgroundImage: undefined,
          },
        },
      },
    };
  }

  return withNewLayoutOverrides(getLightTheme());
};
