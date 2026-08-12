import React, { useMemo } from "react";
import { Provider } from "react-redux";

import { ErrorBoundry } from "../../Root/import";
import App from "./App";
import { MainProps } from "./common/interface";
import Root, { classes, PREFIX } from "./common/style";
import createStore from "./store";

const Main: React.FC<MainProps> = (props: MainProps): React.ReactElement => {
  const store = useMemo(() => createStore(), []);
  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <Provider store={store}>
          <App {...props} />
        </Provider>
      </Root>
    </ErrorBoundry>
  );
};

export default Main;
