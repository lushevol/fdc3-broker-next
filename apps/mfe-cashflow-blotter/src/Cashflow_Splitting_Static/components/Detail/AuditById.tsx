import { memo } from "react";
import { StaticRuleRow } from "src/Cashflow_Splitting_Static/services/api.type";
import { useAppSelector } from "src/Cashflow_Splitting_Static/store";

import { SplitAuditDataGrid } from "../Audit/AuditDataGrid";

export const AuditById = memo(() => {
  const { detailData } = useAppSelector((state) => state.detail);

  return (
    <div
      className="split-audit-by-id-root"
      style={{ flex: 1, display: "flex", height: "100%" }}
      data-testid="split-audit-by-id-blotter"
    >
      <SplitAuditDataGrid id={(detailData as StaticRuleRow).id + ""} />
    </div>
  );
});
