import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { TileProps } from "src/Root/routing/common/interface";

import { ErrorBoundry } from "../Root/import";
import { App } from "./App";
import createStore from "./store";

const Main: React.FC<TileProps> = (props: TileProps): React.ReactElement => {
  const store = useMemo(() => createStore(), []);
  return (
    <ErrorBoundry>
      <Provider store={store}>
        <App {...props} />
      </Provider>
    </ErrorBoundry>
  );
};

export default Main;
