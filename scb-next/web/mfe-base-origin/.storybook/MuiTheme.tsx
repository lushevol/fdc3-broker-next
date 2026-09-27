import React from "react";
import { ThemeProvider } from "ratan-design-origin/theme";
import { CssBaseline } from "ratan-design-origin/primitives";
import CreateTheme from "../src/theme/Config";
import { getTheme } from "../src/theme/config/utils";
import { LocalizationProvider, AdapterDayjs } from "ratan-design-origin/dates";

const MuiTheme = (Story, context) => {
  const { theme: themeKey } = context.globals;
  const theme = React.useMemo(() => {
    const { config } = CreateTheme(getTheme(themeKey));
    return config
  }, [themeKey]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default MuiTheme
