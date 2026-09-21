import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, MenuItem, Select } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Config, getPortalTheme } from "ratan-design-origin/portal-theme";

const columns: GridColDef[] = [
  { field: "symbol", headerName: "Symbol", width: 160 },
  { field: "quantity", headerName: "Quantity", width: 160 },
];

const rows = [
  { id: 1, symbol: "SGDUSD", quantity: 125000 },
  { id: 2, symbol: "EURUSD", quantity: 80000 },
];

function PortalApp() {
  const [mode, setMode] = React.useState("light");
  const theme = React.useMemo(
    () => Config(getPortalTheme(mode, true, true)).config,
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main
        style={{
          boxSizing: "border-box",
          minHeight: "100vh",
          padding: 24,
          background: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <label>
          Mode
          <Select
            aria-label="Portal mode"
            size="small"
            value={mode}
            onChange={(event) => setMode(String(event.target.value))}
          >
            <MenuItem value="light">light</MenuItem>
            <MenuItem value="dark">dark</MenuItem>
          </Select>
        </label>
        <div style={{ height: 260, marginTop: 24, maxWidth: 480 }}>
          <DataGrid
            aria-label="Positions"
            columns={columns}
            rows={rows}
            disableRowSelectionOnClick
            hideFooter
          />
        </div>
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<PortalApp />);
