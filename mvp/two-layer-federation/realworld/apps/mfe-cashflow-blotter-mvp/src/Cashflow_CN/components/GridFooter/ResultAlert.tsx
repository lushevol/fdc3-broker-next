import { Alert, css, Divider, styled } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";

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

const ResultAlert = () => {
  const cashflowListQueryPageSize = useSelector(
    (state: RootState) => state.cashflowListQueryPageSize
  );
  const [open, setOpen] = useState(true);
  return open ? (
    <>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ margin: "0 20px" }}
      />
      <StyledAlert
        variant="outlined"
        severity="info"
        onClose={() => setOpen(false)}
      >
        If more than {cashflowListQueryPageSize} records are loaded, column
        filters below will be applied only within the first{" "}
        {cashflowListQueryPageSize} records.
      </StyledAlert>
    </>
  ) : (
    <></>
  );
};

export default ResultAlert;
