import React, { ReactElement } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Root, { classes, PREFIX } from "./common/style";
import ErrorBoundry from "../../components/ErrorBoundry";
import { VersionProps } from "./common/interface";
import { getEnv } from "../../utils/common";

const Version: React.FC<VersionProps> = (props: VersionProps): ReactElement => {
  return (
    <ErrorBoundry>
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        variant="filled"
        severity="info"
      >
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
