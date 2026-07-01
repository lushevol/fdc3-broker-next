import _get from "lodash/get";
import _set from "lodash/set";

import {
  CashflowNewSplittingParamsItem,
  NewSplitPreviewResponseItem,
} from "./interface";

const params2datamodel: { [key in keyof NewSplitPreviewResponseItem]: string } =
  {
    dataSourceSystem: "Data_Flow.Data_Source_System",
    cashflowId: "Cashflow.Cashflow_Id",
    cashflowState: "Cashflow.Cashflow_State",
    cashflowSubState: "Cashflow.Cashflow_Sub_State",
    cashflowSubStateType: "Cashflow.Cashflow_Sub_State_Type",
    businessVersion: "Cashflow.Cashflow_Business_Version",
    cashflowVersion: "Cashflow.Cashflow_Version",
    minorVersion: "Cashflow.Cashflow_Minor_Version",
    netId: "Cashflow.Netting_Id",
    eventType: "Cashflow.Cashflow_Event_Type",
    paymentDate: "Cashflow.Payment_Date",
    amount: "Cashflow.Payment_Amount",
    currency: "Cashflow.Payment_Currency",
    payRec: "Cashflow.Pay_Receive_Indicator",
    bookingEntityFmid: "Entity.Booking_Entity_SCI_FMID",
    counterpartyFmid: "Entity.Counterparty_SCI_FMID",
    allotment: "Instrument_Common.Source_System_Instrument_Sub_Type",
    cfiCode: "Instrument_Common.Financial_Instrument_Code",
    counterpartyFmCode: "Entity.Counterparty_SCI_FMCODE",
    bookingEntityFmCode: "Entity.Booking_Entity_SCI_FMCODE",
    entryTime: "Data_Flow.Data_Publication_Date_Time",
    paymentType: "Cashflow.Payment_Type",
    taxonomy: "Instrument_Common.ISDA_Taxonomy",
    bicNetFlag: "Entity.Counterparty_SCI_BIC_Net_Flag",
    beneficiaryBic: "Entity.Counterparty_SCI_BIC_Code",
  };

export const splitPreviewDataParser = (
  item: NewSplitPreviewResponseItem | CashflowNewSplittingParamsItem
) => {
  return Object.entries(params2datamodel).reduce(
    (res, cur) => {
      _set(res, cur[1], _get(item, cur[0]));
      return res;
    },
    {
      id: item.cashflowId,
    } as CNCashflow
  );
};

export const splitPreviewDataExtracter = (
  item: CNCashflow
): CashflowNewSplittingParamsItem => {
  return Object.entries(params2datamodel).reduce((res, cur) => {
    const value = _get(item, cur[1]);
    value && _set(res, cur[0], value);
    return res;
  }, {} as CashflowNewSplittingParamsItem);
};
