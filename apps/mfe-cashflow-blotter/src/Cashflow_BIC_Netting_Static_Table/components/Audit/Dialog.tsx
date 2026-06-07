import { closeAuditDialog } from "src/Cashflow_BIC_Netting_Static_Table/store/audit.slice";
import { MuiDialog } from "src/Root/import/ratancomponents";

import { useAppDispatch, useAppSelector } from "../../store";
import { RulesAuditDataGrid } from "./AuditDataGrid";

export const BicNettingStaticAuditDialog = () => {
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
      data-testid="bic-netting-static-audit-dialog"
    >
      {openDialog && <RulesAuditDataGrid />}
    </MuiDialog>
  );
};
