import { css, styled } from "@mui/material";
import { closeAuditDialog } from "src/Cashflow_Splitting_Static/store/audit.slice";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { SplitAuditDataGrid } from "./AuditDataGrid";

const AuditDialog = styled(MuiDialog)(
  css`
    .MuiDialog-paper {
      margin-top: 0;
      .MuiDialogContent-root {
        display: flex;
        padding: 10px 13px 10px 10px !important;
      }
    }
  `
);

export const SplittingStaticAuditDialog = () => {
  const dispatch = useAppDispatch();
  const { openDialog } = useAppSelector((state) => state.audit);

  return (
    <AuditDialog
      open={openDialog}
      onClose={() => dispatch(closeAuditDialog())}
      title="Audit History"
      width="1200px"
      height="750px"
      enableResize
      data-testid="auto-split-static-audit-dialog"
    >
      {openDialog && <SplitAuditDataGrid />}
    </AuditDialog>
  );
};
