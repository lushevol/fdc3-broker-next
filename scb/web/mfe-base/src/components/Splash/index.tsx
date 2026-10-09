import React, { ReactElement } from "react";
import Root, { classes, PREFIX } from "./common/style";
import { LoadingOverlay } from "ratan-design-origin";
import ErrorBoundry from "../../components/ErrorBoundry";

const Splash: React.FC = (): ReactElement => {
  return (
    <ErrorBoundry>
      <LoadingOverlay open component={Root} sx={{ height: "100vh" }}
        className={classes.root} data-testid={`${PREFIX}`}>
          <div className={classes.splash}>Please wait...</div>
      </LoadingOverlay>
    </ErrorBoundry>
  );
};

export default React.memo(Splash);
