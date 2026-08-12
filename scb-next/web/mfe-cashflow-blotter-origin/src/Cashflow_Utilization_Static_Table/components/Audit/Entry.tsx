import { Button } from "antd";
import { UTILIZATION_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";

import { useAppDispatch } from "../../store";
import { openAuditDialog } from "../../store/audit.slice";

export const AuditEntry = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      data-testid={UTILIZATION_STATIC_BLOTTER_AUDIT_BTN}
      onClick={() => dispatch(openAuditDialog())}
    >
      Audit
    </Button>
  );
};
