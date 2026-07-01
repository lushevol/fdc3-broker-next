import React from "react";

import { ErrorBoundry } from "../../Root/import";
import App from "./App";
import { MainProps } from "./common/interface";
import Root, { classes } from "./common/style";

const Main: React.FC<MainProps> = (props: MainProps): React.ReactElement => {
  return (
    <ErrorBoundry>
      <Root className={classes.root}>
        <App {...props} />
      </Root>
    </ErrorBoundry>
  );
};

export default Main;
