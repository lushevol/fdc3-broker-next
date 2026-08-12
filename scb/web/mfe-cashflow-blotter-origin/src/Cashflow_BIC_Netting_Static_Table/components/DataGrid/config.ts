import { ColDef } from "ag-grid-community";

export const dataGridColumnsDef: ColDef[] = [
  {
    headerCheckboxSelection: false,
    checkboxSelection: true,
    sortable: false,
    menuTabs: [],
    resizable: false,
    maxWidth: 42,
    minWidth: 42,
    hide: false,
    pinned: "left",
    lockPosition: true,
  },
  {
    headerName: "ID",
    field: "id",
    minWidth: 70,
  },
  {
    headerName: "Status",
    field: "dataStatus",
    minWidth: 150,
  },
  {
    headerName: "Family",
    field: "family",
    minWidth: 350,
    flex: 1,
  },
  {
    headerName: "Entity FM Id",
    field: "entityFmId",
    minWidth: 150,
  },
  {
    headerName: "Group",
    field: "group",
    minWidth: 150,
  },
  {
    headerName: "Type",
    field: "type",
    minWidth: 150,
  },
  {
    headerName: "Typology",
    field: "typology",
    minWidth: 200,
  },
  {
    headerName: "Strategy",
    field: "strategy",
    minWidth: 150,
  },
  {
    headerName: "Beneficiary BIC",
    field: "beneficiaryBic",
    minWidth: 150,
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    minWidth: 220,
  },
];

export const DEFAULT_PAGINATION_SIZE = 50;
