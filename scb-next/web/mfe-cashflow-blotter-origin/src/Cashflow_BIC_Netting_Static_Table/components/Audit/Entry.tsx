import { Button } from "antd";
import { useAppDispatch } from "src/Cashflow_BIC_Netting_Static_Table/store";
import { openAuditDialog } from "src/Cashflow_BIC_Netting_Static_Table/store/audit.slice";
import { BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";

export const AuditEntry = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      data-testid={BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN}
      onClick={() => dispatch(openAuditDialog())}
    >
      Audit
    </Button>
  );
};
