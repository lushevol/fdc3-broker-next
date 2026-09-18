import React from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider } from "@mui/material/styles";
import { Config, getPortalTheme } from "ratan-design-origin/portal-theme";
import { Button } from "ratan-design-origin";

for (const mode of ["light", "dark", "gold"]) {
  const { config } = Config(getPortalTheme(mode, true, true));
  const html = renderToString(<ThemeProvider theme={config}><Button>Portal control</Button></ThemeProvider>);
  if (!html.includes("Portal control") || config.theme.LoginPage.contentWidth !== "306px"
    || config.customColor.blue !== "#2f82ff"
    || !config.components?.MuiDataGrid?.styleOverrides?.root) {
    throw new Error("Portal theme lost controls, extensions or optional grid declarations");
  }
}
console.log("DOM-free opt-in portal theme SSR passed");
