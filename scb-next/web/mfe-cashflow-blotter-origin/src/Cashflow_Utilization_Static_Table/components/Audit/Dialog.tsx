import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { closeAuditDialog } from "../../store/audit.slice";
import { RulesAuditDataGrid } from "./AuditDataGrid";

export const UtilizationStaticAuditDialog = () => {
  const dispatch = useAppDispatch();
  const { openDialog } = useAppSelector((state) => state.audit);

  return (
    <MuiDialog
      open={openDialog}
      onClose={() => dispatch(closeAuditDialog())}
      title="Audit History"
      width="1100px"
      height="520px"
      enableResize
      data-testid="utilization-static-audit-dialog"
    >
      {openDialog && <RulesAuditDataGrid />}
    </MuiDialog>
  );
};
