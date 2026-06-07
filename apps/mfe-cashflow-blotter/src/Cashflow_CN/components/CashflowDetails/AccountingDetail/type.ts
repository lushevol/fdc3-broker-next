import { RowNode } from "ag-grid-community";

export type AccountTableData = {
  accountNumber: string;
  transactionNature: string;
  externalSystemKey: string;
  createdAt: string;
  updatedAt: string;
  taskStatus: string;
  reason: string;
  transactionAmount: string;
  currency: string;
  action: string;
};

export type AggridCustomCellProps = {
  data: AccountTableData;
  node: RowNode;
  rowIndex: number;
  triggerRepublish: (externalSystemKeys: string[]) => Promise<void>;
};
