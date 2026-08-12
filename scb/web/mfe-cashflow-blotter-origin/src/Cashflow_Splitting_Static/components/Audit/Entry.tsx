import { Button } from "Import/index";
import { useAppDispatch } from "src/Cashflow_Splitting_Static/store";
import { openAuditDialog } from "src/Cashflow_Splitting_Static/store/audit.slice";
import { AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";

export const AuditEntry = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      data-testid={AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN}
      onClick={() => dispatch(openAuditDialog())}
      style={{ width: "80px" }}
      variant="outlined"
      size="medium"
    >
      Audit
    </Button>
  );
};
