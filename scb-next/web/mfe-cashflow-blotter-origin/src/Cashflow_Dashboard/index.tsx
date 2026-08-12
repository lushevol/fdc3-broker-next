import React, { memo, useMemo } from "react";
import { Provider } from "react-redux";

import { TileProps } from "../Root/routing/common/interface";
import Main from "./Main";
import { createStore } from "./Main/store-redux";

const CashflowDashboard: React.FC<TileProps> = memo(
  (props: TileProps): React.ReactElement => {
    const store = useMemo(() => createStore(), []);
    return (
      <Provider store={store}>
        <Main {...props} />
      </Provider>
    );
  }
);
export default CashflowDashboard;
