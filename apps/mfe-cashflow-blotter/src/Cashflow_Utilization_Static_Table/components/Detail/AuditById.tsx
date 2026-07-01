import { memo } from "react";

import { UtilizationRuleRow } from "../../services/api.type";
import { useAppSelector } from "../../store";
import { RulesAuditDataGrid } from "../Audit/AuditDataGrid";

export const AuditById = memo(() => {
  const { detailData } = useAppSelector((state) => state.detail);

  return <RulesAuditDataGrid id={(detailData as UtilizationRuleRow).id + ""} />;
});
