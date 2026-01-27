import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { type ReactElement } from 'react';
import type { ErrorState } from '../../hooks/model/root';
import { getHostName } from '../../utils/common';
import Root, { classes } from './common/style';
import useController from './common/useController';

const Fallback: React.FC<ErrorState> = (props: ErrorState): ReactElement => {
  const { emailSupport } = useController(props);

  return (
    <Root className={classes.root} data-testid="FallbackError__page-id">
      <Stack spacing={2} direction="column">
        <Typography variant="h6" gutterBottom>
          There is a problem in this Tile.
        </Typography>
        {emailSupport ? (
          <>
            <Typography variant="body1" gutterBottom>
              Please click the button below to send the Error detail to the Application Support
              Team.
            </Typography>
            <div>
              <Button
                size="medium"
                variant="outlined"
                color="info"
                href={`mailto:${emailSupport}?subject=Error in ${getHostName()}&body=${
                  props.error?.stack
                }`}
              >
                Contact PSS
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </Stack>
    </Root>
  );
};

export default React.memo(Fallback);
