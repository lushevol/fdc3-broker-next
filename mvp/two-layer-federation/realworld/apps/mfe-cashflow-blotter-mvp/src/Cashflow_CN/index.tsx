import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { E2ELatencyStoreWrap } from "src/Root/analysis";

import { TileProps } from "../Root/routing/common/interface";
import Main from "./Main";
import createStore from "./Main/store";

const Cashflow: React.FC<TileProps> = (
  props: TileProps
): React.ReactElement => {
  const store = useMemo(() => createStore(), []);
  return (
    <E2ELatencyStoreWrap>
      <Provider store={store}>
        <Main {...props} />
      </Provider>
    </E2ELatencyStoreWrap>
  );
};
export default Cashflow;
