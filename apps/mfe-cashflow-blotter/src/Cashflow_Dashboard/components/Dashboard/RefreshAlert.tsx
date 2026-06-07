import { Alert, css, styled } from "@mui/material";
import { useState } from "react";

import { DASHBOARD_REFRESH_INTERVAL } from "./const";

const StyledAlert = styled(Alert)(
  () => css`
    padding: 0 6px;
    opacity: 0.8;
    .MuiAlert-icon {
      padding: 3px 0;
    }
    .MuiAlert-message {
      padding: 6px 0;
    }
    .MuiAlert-action {
      padding: 0 0 0 6px;
    }
    border: 1px dashed #03a9f4;
  `
);

const RefreshAlert = () => {
  const [open, setOpen] = useState(true);
  return open ? (
    <StyledAlert
      variant="outlined"
      severity="info"
      onClose={() => setOpen(false)}
    >
      {`Data will be auto refreshed every ${
        DASHBOARD_REFRESH_INTERVAL / 1000
      } seconds.`}
    </StyledAlert>
  ) : (
    <></>
  );
};

export default RefreshAlert;
