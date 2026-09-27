import React, { ReactElement } from "react";
import Provider from "./hooks/provider";
import ThemeProvider from "./theme";
import Routing from "./routing";
import { LocalizationProvider, AdapterDayjs } from "ratan-design-origin/dates";

export interface AppProps {
  version?: string;
  newStyles?: boolean;
  [key: string]: unknown;
}

const App: React.FC<AppProps> = (props): ReactElement => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider
      data={{ rootVersion: props.version, newStyles: props.newStyles ?? false }}
    >
      <ThemeProvider>
        <Routing {...props} />
      </ThemeProvider>
    </Provider>
  </LocalizationProvider>
);

export default App;
