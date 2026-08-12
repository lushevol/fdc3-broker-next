import { App as AntdApp } from "antd";
import React from "react";

import MfeThemeProvider from "./Root/common/component/MfeThemeProvider";
import Routing from "./Root/routing";
import { TileProps } from "./Root/routing/common/interface";

const App: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  <MfeThemeProvider>
    <AntdApp style={{ height: "100%" }}>
      <Routing {...props} />
    </AntdApp>
  </MfeThemeProvider>
);

export default App;
