import React, { ReactElement } from "react";
import ErrorBoundry from "../../../components/ErrorBoundry";
import { CheckCircleOutlined as CheckCircleOutlineIcon, Dangerous as DangerousIcon } from "ratan-design-origin/icons";
import { Tooltip } from "ratan-design-origin/primitives";

interface StatusProps {
  value?: boolean;
}

const Status = (props: StatusProps): ReactElement => {
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
