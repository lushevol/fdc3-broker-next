export type ManualStpCashflowDataType = {
  Id: string;
  Group_Id: string;
  Trade_Id: string;
  Major_Version: number;
  Is_Trade_Validated: boolean | null;
  Mxg_Trade_Id: string;
  Cashflow_Id: string;
  Cashflow_Count: number | string;
  Cashflow_Sequence: number | string;
  Business_Event: string;
  Business_Version: number;
  Booking_System_Event: string;
  Cashflow_Event_Reason: string;
  Status: string;
  Cashflow_Status: string;
  Group_Status: string;
  Group_Event: string;
  Pending_Reason: string;
  Payment_Currency: string;
  Payment_Amount: string | number;
  Original_Payment_Id: string | number;
  Is_Group_Locked: boolean | null;
  Updated_By: string;
  Create_At: string;
  Update_At: string;
  Booking_Entity_Id: string | number;
  Counterparty_Fm_Id: string | number;
  Value_Date: string;
  Commodity_Flag?: string | null;
  Pay_Direction: string;
  ISDA_Taxonomy: string;
};

export type CommonRespDataType<T = any> = {
  errorCode: number;
  errorMessage: string;
  data: T;
};

export type GroupManualStpResponse = CommonRespDataType[];
