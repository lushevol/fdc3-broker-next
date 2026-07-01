import { ColDef } from "ag-grid-community";

export const dataGridColumnsDef: ColDef[] = [
  {
    headerName: "ID",
    field: "id",
    width: 70,
  },
  {
    headerName: "Status",
    field: "dataStatus",
    width: 160,
  },
  {
    headerName: "Counterparty FM Code",
    field: "counterpartyFmCode",
    flex: 1,
  },
  {
    headerName: "Counterparty FMID",
    field: "counterpartyFmId",
    flex: 1,
  },
  {
    headerName: "Entity FMID",
    field: "entityFmId",
    flex: 1,
  },
  {
    headerName: "Entity FM Code",
    field: "entityFmCode",
    flex: 1,
  },
  {
    headerName: "Auto Util",
    field: "autoUtil",
    flex: 1,
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    width: 220,
  },
];

export const DEFAULT_PAGINATION_SIZE = 100;
