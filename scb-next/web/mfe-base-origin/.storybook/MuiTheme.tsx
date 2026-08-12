import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CreateTheme from "../src/theme/Config";
import { getTheme } from "../src/theme/config/utils";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";

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
