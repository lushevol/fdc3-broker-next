import React, { ReactElement } from "react";
import Provider from "./hooks/provider";
import ThemeProvider from "./theme";
import Routing from "./routing";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";

export interface AppProps {
  version?: string;
  [key: string]: unknown;
}

const App: React.FC<AppProps> = (props): ReactElement => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider data={{ rootVersion: props.version }}>
      <ThemeProvider>
        <Routing {...props} />
      </ThemeProvider>
    </Provider>
  </LocalizationProvider>
);

export default App;
