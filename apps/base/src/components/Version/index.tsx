import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import { getEnv } from '../../utils/common';
import type { VersionProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const Version: React.FC<VersionProps> = (props: VersionProps): ReactElement => {
  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`} variant="filled" severity="info">
        <Stack spacing={1} direction="row">
          <Typography
            variant="caption"
            display="block"
            gutterBottom
          >{`Version: ${props.version}`}</Typography>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
          >{`Env: ${getEnv()}`}</Typography>
        </Stack>
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Version);
