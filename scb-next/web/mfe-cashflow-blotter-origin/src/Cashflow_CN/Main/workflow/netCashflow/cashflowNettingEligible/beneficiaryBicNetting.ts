import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { logger } from "src/Root/import/ratanutils";

import netValidationError from "../netValidationError";

export const canBeneficiaryBICNetting = (cashflow: CNCashflow) => {
  return (
    ["WAITING"].includes(cashflow.Cashflow?.Cashflow_State!) &&
    ["Pending Netting", "Pending Auto Netting"].includes(
      cashflow.Cashflow?.Cashflow_Sub_State_Type!
    ) &&
    ["SCB LONDON*LDN"].includes(cashflow.Entity?.Booking_Entity_SCI_FMCODE!) &&
    cashflow.Entity?.Counterparty_SCI_BIC_Net_Flag === "Y" &&
    !cashflow.Cashflow?.Splitting_Id
  );
};

export const beneficiaryBICNettingValidation = (
  selectedData: CNCashflow[],
  options: WorkflowActionExtraOptions
) => {
  const { modalApi } = options;
  const entityArray: string[] = [];
  const valueDateArray: string[] = [];
  const beneficiaryBICArray: string[] = [];
  const netIdArray: string[] = [];
  const errorMessageData: Array<Record<string, string | null | undefined>> = [];
  const tradeOriginalSourceSysNameArr: CNCashflow[] = [];
  let loanIQValidationPassed = true;

  selectedData.forEach((item) => {
    entityArray.push(item.Entity?.Booking_Entity_SCI_FMID + "");
    valueDateArray.push(item.Cashflow?.Payment_Date + "");
    beneficiaryBICArray.push(item.Entity?.Counterparty_SCI_BIC_Code + "");
    if (item.Cashflow?.Netting_Id)
      netIdArray.push(item.Cashflow?.Netting_Id + "");

    if (item.Trade_Original_Source_System_Name?.toUpperCase() === "LOANIQ")
      tradeOriginalSourceSysNameArr.push(item);

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
  });

  if (
    tradeOriginalSourceSysNameArr.length > 0 &&
    tradeOriginalSourceSysNameArr.length < selectedData.length
  ) {
    loanIQValidationPassed = false;
  }

  const errorContentArray: string[] = extractErrorContent({
    entityArray,
    beneficiaryBICArray,
    valueDateArray,
    netIdArray,
    loanIQValidationPassed,
  });

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

export const extractErrorContent = ({
  beneficiaryBICArray,
  entityArray,
  valueDateArray,
  netIdArray,
  loanIQValidationPassed = true,
}: {
  beneficiaryBICArray: string[];
  entityArray: string[];
  valueDateArray: string[];
  netIdArray: string[];
  loanIQValidationPassed: boolean;
}) => {
  const errorContentArray: string[] = [];
  if (
    featureScopedEnabled("LoanIQ_Netting_Validation") &&
    loanIQValidationPassed === false
  ) {
    errorContentArray.push(
      "Netting not allowed for LOANIQ with other product cashflows."
    );
  }
  if (
    new Set(entityArray).size > 1 ||
    new Set(valueDateArray).size > 1 ||
    new Set(beneficiaryBICArray).size > 1
  ) {
    errorContentArray.push(
      "Cash flow selected are not eligible for Beneficiary BIC netting as either the same booking entity, value date, bic code."
    );
  }

  if (netIdArray.length > 0) {
    errorContentArray.push(
      `Cash flow selected can't perform Netting on the netted resultant cash flow`
    );
  }
  return errorContentArray;
};
