import "./style/tailwind.css";
import "./icon/IconFont.css";
import "./style/app.css"; // TODO remove css

import React from "react";
import { ReactRouterDom } from "src/Root/import/index";
const { MemoryRouter } = ReactRouterDom;

import Layout from "./Layout";
import MfeThemeProvider from "./Root/common/component/MfeThemeProvider";
import Routing from "./Root/routing";
import { TileProps } from "./Root/routing/common/interface";
const App: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <MfeThemeProvider>
    <MemoryRouter>
      <Layout>
        <Routing {...props} />
      </Layout>
    </MemoryRouter>
  </MfeThemeProvider>
);

export default App;
