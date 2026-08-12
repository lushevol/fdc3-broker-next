import { RowNode } from "ag-grid-community";
import { BicNettingRuleRow } from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";

export type AggridCustomCellProps = {
  data: BicNettingRuleRow;
  node: RowNode;
  rowIndex: number;
};
