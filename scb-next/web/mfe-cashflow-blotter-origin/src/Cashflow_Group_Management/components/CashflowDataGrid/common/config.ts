import { ColDef } from "ag-grid-community";

export const defaultGridFieldsDef: ColDef[] = [
  {
    headerName: "Trade Id",
    field: "Mxg_Trade_Id",
  },
  {
    headerName: "Cashflow Id",
    field: "Cashflow_Id",
  },
  {
    headerName: "Value Date",
    field: "Value_Date",
    cellDataType: "text",
  },
  {
    headerName: "Currency",
    field: "Payment_Currency",
  },
  {
    headerName: "Pay/Receive",
    field: "Pay_Direction",
  },
  {
    headerName: "Amount",
    field: "Payment_Amount",
  },
  {
    headerName: "Booking Entity FMCODE",
    field: "Booking_Entity_Fm_Code",
  },
  {
    headerName: "Counterparty FMCODE",
    field: "Counterparty_Fm_Code",
  },
  {
    headerName: "Client Domicile Country",
    field: "Client_Domicile_Country",
  },
  {
    headerName: "Commodity Flag",
    field: "Commodity_Flag",
  },
  {
    headerName: "ISDA Taxonomy",
    field: "ISDA_Taxonomy",
  },
  {
    headerName: "Pending Reason",
    field: "Pending_Reason",
  },
  {
    headerName: "Booking Entity FMID",
    field: "Booking_Entity_Id",
  },
  {
    headerName: "Counterparty FMID",
    field: "Counterparty_Fm_Id",
  },
  {
    headerName: "Status",
    field: "Status",
  },
  {
    headerName: "Cashflow Status",
    field: "Cashflow_Status",
  },
  {
    headerName: "Group Status",
    field: "Group_Status",
  },
  {
    headerName: "Booking System Event",
    field: "Booking_System_Event",
  },
  {
    headerName: "Business Event",
    field: "Business_Event",
  },
  {
    headerName: "Business Version",
    field: "Business_Version",
  },
  {
    headerName: "Group Event",
    field: "Group_Event",
  },
  {
    headerName: "Major Version",
    field: "Major_Version",
  },
  {
    headerName: "Cashflow Count",
    field: "Cashflow_Count",
  },
  {
    headerName: "Original Trade Id",
    field: "Trade_Id",
  },
  {
    headerName: "Original Cashflow Id",
    field: "Original_Payment_Id",
  },
  {
    headerName: "Cashflow Sequent",
    field: "Cashflow_Sequence",
  },
  {
    headerName: "Group Id",
    field: "Group_Id",
  },
  {
    headerName: "Event Reason",
    field: "Cashflow_Event_Reason",
  },
  {
    headerName: "Update At",
    field: "Update_At",
  },
  {
    headerName: "Trade Validation",
    field: "Is_Trade_Validated",
    cellDataType: "text",
  },
  {
    headerName: "Update By",
    field: "Updated_By",
  },
];
