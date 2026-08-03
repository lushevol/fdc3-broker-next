import { WorkflowActionExtraOptions } from "src/Cashflow_CN/Main/common/interface";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { logger } from "src/Root/import/ratanutils";

import netValidationError from "../netValidationError";

const IRSAvailableStateListForNetting = ["PROJECTED", "WAITING", "READY"];
const availableStateListForNetting = ["PROJECTED", "WAITING", "READY"];
const validateGenericNetting = (cashflow: CNCashflow) => {
  return (
    cashflow.Entity?.Counterparty_SCI_BIC_Net_Flag !== "Y" &&
    cashflow.Settlement_Method! !== "CCIL" &&
    availableStateListForNetting.includes(
      cashflow.Cashflow?.Cashflow_State as string
    ) &&
    !cashflow.Cashflow?.Splitting_Id
  );
};

export const validateCCILGuaranteedNetting = (cashflow: CNCashflow) => {
  return (
    cashflow.Entity?.Counterparty_SCI_BIC_Net_Flag !== "Y" &&
    ["CCIL"].includes(cashflow.Settlement_Method!) &&
    ["WAITING"].includes(cashflow.Cashflow?.Cashflow_State!) &&
    ["Pending Netting", "Pending Auto Netting"].includes(
      cashflow.Cashflow?.Cashflow_Sub_State_Type!
    ) &&
    cashflow.Entity?.Counterparty_SCI_FMID === "400021949" &&
    !cashflow.Cashflow?.Splitting_Id
  );
};

export const cashflowCanBeBilateralNetting = (cashflow: CNCashflow) => {
  return (
    validateGenericNetting(cashflow) || validateCCILGuaranteedNetting(cashflow)
  );
};

export const bilateralNettingValidation = (
  selectedData: CNCashflow[],
  options: WorkflowActionExtraOptions
) => {
  const { modalApi } = options;
  const blockCashflowStatusArray: CNCashflow[] = [];

  const fmidArray: string[] = [];
  const currencyArray: string[] = [];
  const entityArray: string[] = [];
  const valueDateArray: string[] = [];

  const blockDeliverMethodArray: CNCashflow[] = [];
  const blockSubStatusEventType: CNCashflow[] = [];
  const errorMessageData: any[] = [];
  const pendingAck: CNCashflow[] = [];
  const tradeOriginalSourceSysNameArr: CNCashflow[] = [];

  selectedData.forEach((item) => {
    if (!validateState(item)) {
      blockCashflowStatusArray.push(item);
    }

    fmidArray.push(item.Entity?.Counterparty_SCI_FMID + "");
    // batch netting allows multi currencies now
    currencyArray.push(item.Cashflow?.Payment_Currency + "");
    entityArray.push(item.Entity?.Booking_Entity_SCI_FMID + "");
    valueDateArray.push(item.Cashflow?.Payment_Date + "");

    if (item.Cashflow?.Cashflow_Sub_State_Type === "Auto Netting") {
      blockSubStatusEventType.push(item);
    }
    // CN: Delivery_Method => Settlement_Method
    /**
     * To be do
     * @author LuShuai
     * @description unify the judgment of netting resultant cashflow
     */
    if (
      item.Cashflow?.Netting_Id &&
      (item.Delivery_Method || "").toUpperCase() === "GROSS"
    ) {
      blockDeliverMethodArray.push(item);
    }

    if (
      item.Cashflow?.Cashflow_State === "READY" &&
      item.Cashflow.Cashflow_Sub_State_Type === "Pending Ack"
    ) {
      pendingAck.push(item);
    }

    errorMessageData.push({
      "Cashflow.Cashflow_Id": item.Cashflow?.Cashflow_Id,
      "Entity.Counterparty_SCI_FMID": item.Entity?.Counterparty_SCI_FMID,
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

  const loanIQValidationPassed = validateLoanIQ(
    tradeOriginalSourceSysNameArr.length,
    selectedData.length
  );

  const errorContentArray: string[] = extractErrorContent({
    currencyArray,
    fmidArray,
    entityArray,
    valueDateArray,
    blockCashflowStatusArray,
    blockDeliverMethodArray,
    blockSubStatusEventType,
    pendingAck,
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

const extractErrorContent = (errorArrayObj: {
  currencyArray: string[];
  fmidArray: string[];
  entityArray: string[];
  valueDateArray: string[];
  blockCashflowStatusArray: CNCashflow[];
  blockDeliverMethodArray: CNCashflow[];
  blockSubStatusEventType: CNCashflow[];
  pendingAck: CNCashflow[];
  loanIQValidationPassed: boolean;
}) => {
  const errorContentArray: string[] = [];
  if (
    featureScopedEnabled("LoanIQ_Netting_Validation") &&
    errorArrayObj.loanIQValidationPassed === false
  ) {
    errorContentArray.push(
      "Netting not allowed for LOANIQ with other product cashflows."
    );
  }

  if (
    errorArrayObj.currencyArray.length ===
    new Set(errorArrayObj.currencyArray).size
  ) {
    errorContentArray.push(
      "Cash flow selected are not eligible for netting as no currency with pairs."
    );
  }

  if (
    Array.from(new Set(errorArrayObj.fmidArray)).length > 1 ||
    Array.from(new Set(errorArrayObj.entityArray)).length > 1 ||
    Array.from(new Set(errorArrayObj.valueDateArray)).length > 1
  ) {
    errorContentArray.push(
      "Cash flow selected are not eligible for netting as either the counterparty, booking, entity, value date."
    );
  }

  if (errorArrayObj.blockCashflowStatusArray.length > 0) {
    errorContentArray.push(
      `Cash flow selected are not eligible for netting as one or more of the cash flow not in ${availableStateListForNetting
        .map((i) => '"' + i + '"')
        .join(" or ")} status`
    );
  }
  if (errorArrayObj.blockDeliverMethodArray.length > 0) {
    errorContentArray.push(
      `Cash flow selected can't perform Netting on the netted resultant cash flow`
    );
  }

  if (errorArrayObj.blockSubStatusEventType.length > 0) {
    errorContentArray.push(
      `Cash flow selected eligible for netting as sub status type equal 'Auto Netting'`
    );
  }

  if (errorArrayObj.pendingAck.length > 0) {
    errorContentArray.push(
      `Cash flow selected can't perform Netting because ${errorArrayObj.pendingAck.map(
        (i) => i.Cashflow?.Cashflow_Id
      )} have sent to Razor.`
    );
  }

  return errorContentArray;
};

// https://confluence.global.standardchartered.com/pages/viewpage.action?pageId=2726685251
const isIRS = (cashflow: CNCashflow) => {
  return (
    (cashflow.Data_Flow?.Data_Source_System === "Stella" &&
      [
        "InterestRate:IRSwap:FixedFloat",
        "InterestRate:IRSwap:OIS",
        "InterestRate:IRSwap:OIS",
      ].includes(cashflow.Instrument_Common?.ISDA_Taxonomy as string)) ||
    (cashflow.Data_Flow?.Data_Source_System === "Murex" &&
      cashflow.Instrument_Common?.Source_System_Instrument_Sub_Type ===
        "IRD|IRS|")
  );
};
const validateState = (cashflow: CNCashflow) => {
  if (isIRS(cashflow)) {
    return IRSAvailableStateListForNetting.includes(
      cashflow.Cashflow?.Cashflow_State as string
    );
  }
  return availableStateListForNetting.includes(
    cashflow.Cashflow?.Cashflow_State as string
  );
};

const validateLoanIQ = (targetLength: number, fullDataLength: number) => {
  if (targetLength > 0 && targetLength < fullDataLength) {
    return false;
  } else {
    return true;
  }
};
