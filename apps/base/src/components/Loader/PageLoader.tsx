import React, { type ReactElement } from 'react';
import Loader from './';
import Root, { classes, PREFIX } from './common/style';
import type { LoaderProps } from './common/type';
import useController from './common/useController';

const PageLoader: React.FC<LoaderProps> = (props: LoaderProps): ReactElement => {
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
