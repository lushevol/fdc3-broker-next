import React, { ReactElement } from "react";
import useController from "./common/useController";
import Root, { classes, PREFIX } from "./common/style";
import Loader from "./";
import { LoaderProps } from "./common/type";

const PageLoader: React.FC<LoaderProps> = (
  props: LoaderProps
): ReactElement => {
  useController();
  return (
    <Root className={classes.root} data-testid={`${PREFIX}_Page`}>
      <div className={classes.page}>
        <Loader {...props} />
      </div>
    </Root>
  );
};

export default React.memo(PageLoader);
