import React from "react";
import {
  Theme,
  ThemeProvider as MuiThemeProvider,
} from "ratan-design-origin/theme";
import { CssBaseline } from "ratan-design-origin/primitives";
import { LocalizationProvider, AdapterDayjs } from "ratan-design-origin/dates";

interface ThemeProviderProps {
  theme: Theme;
  children?: React.ReactNode;
}

const ThemeProvider = ({
  theme,
  children,
}: ThemeProviderProps): React.ReactElement => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
