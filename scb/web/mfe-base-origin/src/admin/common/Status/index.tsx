import React, { ReactElement } from "react";
import ErrorBoundry from "../../../components/ErrorBoundry";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DangerousIcon from "@mui/icons-material/Dangerous";
import Tooltip from "@mui/material/Tooltip";

const Status = (props): ReactElement => {
  const { value } = props;
  return (
    <ErrorBoundry>
      {value ? (
        <Tooltip title="Verified">
          <CheckCircleOutlineIcon color="success" />
        </Tooltip>
      ) : (
        <Tooltip title="Unverified or Deactivated">
          <DangerousIcon color="error" />
        </Tooltip>
      )}
    </ErrorBoundry>
  );
};

export default React.memo(Status);
