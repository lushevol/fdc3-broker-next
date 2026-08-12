import { RowNode } from "ag-grid-community";
import { StaticRuleRow } from "src/Cashflow_Splitting_Static/services/api.type";

export type AggridCustomCellProps = {
  data: StaticRuleRow;
  node: RowNode;
  rowIndex: number;
};
