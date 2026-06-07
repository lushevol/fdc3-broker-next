import { NstpExceptionCell } from "src/Cashflow_CN/components/CashflowDetails/components/NstpExceptionCell";
import { Time } from "src/Root/import/index";
import { CommentsCell, ValueChangeCell } from "src/Root/import/ratandialog";

const CashflowId_CN = {
  headerName: "Cashflow ID",
  field: "Cashflow.Cashflow_Id",
  width: 120,
};

const stellaVersion_CN = {
  headerName: "Cashflow Business Version(Stella)",
  field: "Cashflow.Cashflow_Business_Version",
};

const stellaTechnicalVersion_CN = {
  headerName: "Cashflow Technical Version(Stella)",
  field: "Cashflow.Cashflow_Version",
};

const ratanVersion_CN = {
  headerName: "Cashflow Version(Ratan)",
  field: "Cashflow.Cashflow_Minor_Version",
};

const userPsid = {
  headerName: "User PSID",
  field: "User_PSID",
  width: 170,
};

const cashflowEventType_CN = {
  headerName: "Cashflow Event Type",
  field: "Cashflow.Cashflow_Event_Type",
};

const cashflowStatus_CN = {
  headerName: "Cashflow Status",
  field: "Cashflow.Cashflow_State",
  width: 230,
};

const cashflowSubStatusType_CN = {
  headerName: "Cashflow Sub Status Type",
  field: "Cashflow.Cashflow_Sub_State_Type",
  width: 230,
};

const cashflowSubStatus_CN = {
  headerName: "Cashflow Sub Status",
  field: "Cashflow.Cashflow_Sub_State",
  width: 230,
};

const nstpExceptionCodes_CN = {
  headerName: "NSTP Exception",
  field: "Cashflow.NSTP_Exception",
  width: 230,
  cellRenderer: NstpExceptionCell,
};

const nstpCode_CN = {
  headerName: "NSTP Code",
  field: "Cashflow.NSTP_Reason",
  width: 170,
};

const valueChange = {
  headerName: "Value Change",
  field: "Value_Change",
  cellRenderer: ValueChangeCell,
};

const Comments = {
  headerName: "Comments",
  field: "FMO_Comments",
  width: 300,
  cellRenderer: CommentsCell,
  valueGetter: (params: any) =>
    params.data?.FMO_Comments?.map((com) => com.FMO_Comment).join("\n"),
};

const action = {
  headerName: "Action",
  field: "Action",
};

const actionTime = {
  headerName: "Action Time ",
  field: "Action_Time",
  minWidth: 200,
  cellRenderer: Time,
};

const exceptionType = {
  headerName: "Exception Type",
  field: "Exception_Type",
  minWidth: 250,
  valueGetter: (param: any) => {
    const value = param.data;
    return ratanConfig.exception.exceptionType[value.Exception_Type] || "";
  },
};

export const historyFields_CN = [
  CashflowId_CN,
  stellaVersion_CN,
  stellaTechnicalVersion_CN,
  ratanVersion_CN,
  userPsid,
  cashflowEventType_CN,
  cashflowStatus_CN,
  cashflowSubStatusType_CN,
  cashflowSubStatus_CN,
  nstpExceptionCodes_CN,
  nstpCode_CN,
  action,
  actionTime,
  exceptionType,
  valueChange,
  Comments,
];
