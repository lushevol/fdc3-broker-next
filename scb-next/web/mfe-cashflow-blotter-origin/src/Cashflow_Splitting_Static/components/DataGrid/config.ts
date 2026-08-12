import { ColDef } from "ag-grid-community";

import { CustomCell } from "./CustomCell";

export const dataGridColumnsDef: ColDef[] = [
  {
    headerName: "ID",
    field: "ruleUniqueId",
    minWidth: 70,
  },
  {
    headerName: "Status",
    field: "dataStatus",
    minWidth: 200,
  },
  {
    headerName: "Booking Entity FMID",
    field: "entityFmId",
    minWidth: 300,
    flex: 1,
    cellRenderer: CustomCell,
  },
  {
    headerName: "Booking Entity FMCODE",
    field: "entityFmCode",
    minWidth: 300,
    flex: 1,
  },
  {
    headerName: "Nostro Agent",
    field: "nostroAgent",
    minWidth: 150,
    cellRenderer: CustomCell,
  },
  {
    headerName: "Currency",
    field: "currency",
    minWidth: 150,
  },
  {
    headerName: "Threshold",
    field: "threshold",
    minWidth: 150,
  },
  {
    headerName: "Amount",
    field: "amount",
    minWidth: 150,
  },
  {
    headerName: "Limitation",
    field: "limitation",
    minWidth: 150,
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    minWidth: 220,
  },
];

export const DEFAULT_PAGINATION_SIZE = 100;
