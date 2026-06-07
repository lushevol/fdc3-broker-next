import React from "react";
import MfeThemeProvider from "./Root/component/MfeThemeProvider";
import Routing from "./Root/routing";
import { ContainerProps } from "./Root/routing/common/interface";
import { ReactRouterDom } from "./Root/import";
const { Routes, Route, MemoryRouter } = ReactRouterDom;
const App: React.FC<ContainerProps> = (
  props: ContainerProps
): React.ReactElement => {
  return (
    <MfeThemeProvider>
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<Routing {...props} />}></Route>
        </Routes>
      </MemoryRouter>
    </MfeThemeProvider>
  );
};

export default App;
