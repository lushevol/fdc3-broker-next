import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { logger } from "src/Root/import/ratanutils";

import netValidationError from "../netValidationError";

export const cashflowCanBeCCILNetting = (cashflow: CNCashflow) => {
  return (
    cashflow.Entity?.Counterparty_SCI_BIC_Net_Flag !== "Y" &&
    ["CCIL"].includes(cashflow.Settlement_Method!) &&
    ["WAITING"].includes(cashflow.Cashflow?.Cashflow_State!) &&
    ["Pending Netting", "Pending Auto Netting"].includes(
      cashflow.Cashflow?.Cashflow_Sub_State_Type!
    ) &&
    cashflow.Entity?.Counterparty_SCI_FMID! !== "400021949" &&
    !cashflow.Cashflow?.Splitting_Id
  );
};

export const ccilNettingValidation = (
  selectedData: CNCashflow[],
  options: WorkflowActionExtraOptions
) => {
  const { modalApi } = options;
  const entityArray: string[] = [];
  const valueDateArray: string[] = [];
  const currencyArray: string[] = [];
  const errorContentArray: string[] = [];
  const errorMessageData: any[] = [];
  const tradeOriginalSourceSysNameArr: CNCashflow[] = [];

  selectedData.forEach((item) => {
    entityArray.push(item.Entity?.Booking_Entity_SCI_FMID + "");
    currencyArray.push(item.Cashflow?.Payment_Currency + "");
    valueDateArray.push(item.Cashflow?.Payment_Date + "");
    errorMessageData.push({
      "Cashflow.Cashflow_Id": item.Cashflow?.Cashflow_Id,
      "Cashflow.Payment_Currency": item.Cashflow?.Payment_Currency,
      "Entity.Booking_Entity_SCI_FMID": item.Entity?.Booking_Entity_SCI_FMID,
      "Cashflow.Payment_Date": item.Cashflow?.Payment_Date,
      "Cashflow.Cashflow_Sub_State_Type":
        item.Cashflow?.Cashflow_Sub_State_Type,
      "Cashflow.Netting_Id": item.Cashflow?.Netting_Id,
      Delivery_Method: item.Delivery_Method,
      "Cashflow.Netting_Cuttoff_Date": item.Cashflow?.Netting_Cuttoff_Date,
      Trade_State: item.Trade_State,
    });
    if (item.Trade_Original_Source_System_Name?.toUpperCase() === "LOANIQ")
      tradeOriginalSourceSysNameArr.push(item);
  });

  if (
    featureScopedEnabled("LoanIQ_Netting_Validation") &&
    tradeOriginalSourceSysNameArr.length > 0 &&
    tradeOriginalSourceSysNameArr.length < selectedData.length
  ) {
    errorContentArray.push(
      "Netting not allowed for LOANIQ with other product cashflows."
    );
  }

  if (
    Array.from(new Set(entityArray)).length > 1 ||
    Array.from(new Set(currencyArray)).length > 1 ||
    Array.from(new Set(valueDateArray)).length > 1
  ) {
    errorContentArray.push(
      "Cash flow selected are not eligible for CCIL netting as either the same booking entity, value date, currency."
    );
  }

  if (errorContentArray.length > 0) {
    modalApi.error({
      ...netValidationError("Validation failed", errorContentArray),
    });
    logger.info(
      `Data Validation Failed with data: ${JSON.stringify(
        errorMessageData
      )}, content:${errorContentArray}`
    );
    return false;
  }
  return true;
};
