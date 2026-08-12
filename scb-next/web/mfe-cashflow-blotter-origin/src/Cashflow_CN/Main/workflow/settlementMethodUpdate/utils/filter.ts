import { hasPermission } from "Import/ratanutils";

import {
  CashflowDisplay,
  CashflowEligibleResult,
  ResultStatus,
  SettlementMethodCashflowState,
  SettlementMethodTaxonomy,
  SettlementMethodUpdateResponse,
} from "../type";
import { BULK_UPDATE_LIMIT } from "./utils";

export const isAvaliableUtilCashflowStates: SettlementMethodCashflowState[] = [
  SettlementMethodCashflowState.WAITING,
  SettlementMethodCashflowState.READY,
  SettlementMethodCashflowState.PASTDUE,
];

export const isAvaliableTaxonomy = [
  SettlementMethodTaxonomy.FORWARD,
  SettlementMethodTaxonomy.SPOT,
  SettlementMethodTaxonomy.SWAP,
];

export const insufficientCashflowStates: SettlementMethodCashflowState[] = [
  SettlementMethodCashflowState.ERROR,
  SettlementMethodCashflowState.UTILIZED,
  SettlementMethodCashflowState.PARTIALLY_UTILIZED,
];

/**
 * GROSS and "" are treated as the same value.
 */
const normalizeSettlementMethod = (method: string | undefined | null) => {
  const upper = method?.toUpperCase();
  if (upper === "GROSS" || upper === "") {
    return "GROSS";
  }
  return upper;
};

export const settlementMethodUpdateRightmenuConsistencyValidation = (
  cashflows: CNCashflow[]
): {
  valid: boolean;
  message: string;
} => {
  const uniqueNormalizedMethods = new Set(
    cashflows.map((c) => normalizeSettlementMethod(c.Settlement_Method))
  );
  if (uniqueNormalizedMethods.size > 1) {
    return {
      valid: false,
      message: "Settlement Method of selected cashflows are not the same",
    };
  }
  if (cashflows.length > BULK_UPDATE_LIMIT) {
    return {
      valid: false,
      message: `Limitation for bulk update is ${BULK_UPDATE_LIMIT} cashflow records, please select no more than ${BULK_UPDATE_LIMIT} records`,
    };
  }
  return {
    valid: true,
    message: "",
  };
};

export const hasSettlementMethodUpdatePermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release"
  ) as boolean;

const isMatchGrossCashflowState = (cashflow: CNCashflow): boolean => {
  const state = cashflow.Cashflow?.Cashflow_State;
  const subState = cashflow.Cashflow?.Cashflow_Sub_State;
  const subStateType = cashflow.Cashflow?.Cashflow_Sub_State_Type;

  return (
    state === SettlementMethodCashflowState.WAITING ||
    (state === SettlementMethodCashflowState.READY &&
      subState === "NA" &&
      subStateType === "NA")
  );
};

const isMatchUtilCashflowStaus = (cashflow: CNCashflow) =>
  isAvaliableUtilCashflowStates.includes(
    cashflow.Cashflow?.Cashflow_State as SettlementMethodCashflowState
  );

const isMatchTaxonomy = (cashflow: CNCashflow) =>
  isAvaliableTaxonomy.includes(
    cashflow.Instrument_Common?.ISDA_Taxonomy as SettlementMethodTaxonomy
  );

const isMatchDataSourceSystem = (cashflow: CNCashflow) =>
  cashflow.Data_Flow?.Data_Source_System !== "Ratan";

const isGrossCondition = (cashflow: CNCashflow) =>
  normalizeSettlementMethod(cashflow.Settlement_Method) === "GROSS" &&
  isMatchGrossCashflowState(cashflow) &&
  isMatchTaxonomy(cashflow) &&
  isMatchDataSourceSystem(cashflow);

const isUtilCondition = (cashflow: CNCashflow) =>
  cashflow.Settlement_Method === "UTIL" &&
  isMatchUtilCashflowStaus(cashflow) &&
  isMatchTaxonomy(cashflow) &&
  isMatchDataSourceSystem(cashflow);

export const canBeSettlementMethodUpdate = (cashflow: CNCashflow) =>
  hasSettlementMethodUpdatePermission() &&
  (isGrossCondition(cashflow) || isUtilCondition(cashflow));

export const queryGraqlFilter = (cashflows: CNCashflow[]) => {
  const tradeIds = Array.from(
    new Set(cashflows.map((c) => c.Trade_Id).filter(Boolean))
  ) as string[];
  return [
    {
      field: "Trade_Id",
      operator: "IN",
      values: tradeIds,
    },
  ];
};

export const transformCashflowToDisplay = (
  cashflow: CNCashflow
): CashflowDisplay => {
  return {
    cashflowId: cashflow.Cashflow?.Cashflow_Id,
    tradeId: cashflow.Trade_Id,
    settlementMethod: cashflow.Settlement_Method,
    paymentAmount: cashflow.Cashflow?.Payment_Amount,
    cashflowStatus: cashflow.Cashflow?.Cashflow_State,
    entityCode: cashflow.Entity?.Booking_Entity_SCI_FMCODE,
    counterpartyCode: cashflow.Entity?.Counterparty_SCI_FMCODE,
    currency: cashflow.Cashflow?.Payment_Currency,
    payRec: cashflow.Cashflow?.Pay_Receive_Indicator,
    valueDate: cashflow.Cashflow?.Payment_Date,
    actionResult: {
      status: ResultStatus.None,
      message: "",
    },
  };
};

/**
 * Filters a list of cashflows into two categories: eligible and insufficient for settlement method update.
 */
export const cashflowEligibleFilter = (
  cashflows: CNCashflow[]
): CashflowEligibleResult => {
  const res: CashflowEligibleResult = {
    eligibleForUpdate: { cashflows: [] },
    insufficientForUpdate: { cashflows: [] },
  };

  cashflows.forEach((cashflow) => {
    const displayCashflow = transformCashflowToDisplay(cashflow);
    if (!canBeSettlementMethodUpdate(cashflow)) {
      displayCashflow.insufficientReason = "Cashflow status is not eligible";
      res.insufficientForUpdate.cashflows.push(displayCashflow);
      return;
    }
    res.eligibleForUpdate.cashflows.push(displayCashflow);
  });

  const uniqueSettlementMethods = new Set(
    res.eligibleForUpdate.cashflows.map((c) =>
      normalizeSettlementMethod(c.settlementMethod)
    )
  );

  if (uniqueSettlementMethods.size > 1) {
    const demoted = res.eligibleForUpdate.cashflows.map((cashflow) => ({
      ...cashflow,
      insufficientReason:
        "Settlement Method values are not consistent across cashflows in the same trade",
    }));
    res.insufficientForUpdate.cashflows.push(...demoted);
    res.eligibleForUpdate.cashflows = [];
  }

  return res;
};

export const assignResultToCashflowDisplay = (
  displayCashflows: CashflowDisplay[],
  result: SettlementMethodUpdateResponse[]
): CashflowDisplay[] =>
  displayCashflows.map((cashflow) => {
    const matched = result.find(
      (res) =>
        cashflow.cashflowId && res.cashflowIds.includes(cashflow.cashflowId)
    );

    if (!matched) return cashflow;

    return {
      ...cashflow,
      actionResult: {
        status: matched.success
          ? ResultStatus.SubmitSuccess
          : ResultStatus.SubmitFailed,
        message: matched.errorMessage,
      },
    };
  });
