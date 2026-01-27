import Backdrop from '@mui/material/Backdrop';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Root, { classes, PREFIX } from './common/style';

const Splash: React.FC = (): ReactElement => {
  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <div className={classes.splash}>Please wait...</div>
        </Backdrop>
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Splash);
