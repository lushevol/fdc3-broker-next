import { memo } from "react";
import { BicNettingRuleRow } from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import { useAppSelector } from "src/Cashflow_BIC_Netting_Static_Table/store";

import { RulesAuditDataGrid } from "../Audit/AuditDataGrid";

export const AuditById = memo(() => {
  const { detailData } = useAppSelector((state) => state.detail);

  return <RulesAuditDataGrid id={(detailData as BicNettingRuleRow).id + ""} />;
});
