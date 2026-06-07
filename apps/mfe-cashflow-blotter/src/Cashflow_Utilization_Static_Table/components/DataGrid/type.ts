import { RowNode } from "ag-grid-community";

import { UtilizationRuleRow } from "../../services/api.type";

export type AggridCustomCellProps = {
  data: UtilizationRuleRow;
  node: RowNode;
  rowIndex: number;
};
