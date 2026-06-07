import { Button, Stack } from "@mui/material";
import { FC, useContext } from "react";
import { AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN } from "src/Root/analysis/const";

import { UserRoleContext } from "../../Main/App";
import { OperationActionsProps } from "./interface";
import StyledRoot, { classes } from "./style";

const OperationActions: FC<OperationActionsProps> = ({
  onCreateNewLimitation,
}) => {
  const userRole = useContext(UserRoleContext);
  return (
    <StyledRoot>
      <Stack direction="row" justifyContent="flex-end" className={classes.root}>
        <Button
          variant="contained"
          onClick={onCreateNewLimitation}
          data-testid={AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN}
          disabled={userRole === "Visitor"}
        >
          Create
        </Button>
      </Stack>
    </StyledRoot>
  );
};

export default OperationActions;
