export type ExtraFormSubmitFormDataType = {
  comment: string;
};

export type ExtraFormRef = {
  submit: () => ExtraFormSubmitFormDataType | undefined;
};

export enum SettlementMethodCashflowState {
  WAITING = "WAITING",
  READY = "READY",
  PASTDUE = "PASTDUE",
  ERROR = "ERROR",
  UTILIZED = "UTILIZED",
  PARTIALLY_UTILIZED = "PARTIALLY_UTILIZED",
}

export enum SettlementMethodTaxonomy {
  FORWARD = "ForeignExchange:Forward",
  SPOT = "ForeignExchange:Spot",
  SWAP = "ForeignExchange:Swap",
}
export enum ResultStatus {
  None = "None",
  Submiting = "Submiting",
  SubmitSuccess = "SubmitSuccess",
  SubmitFailed = "SubmitFailed",
}

export type CashflowDisplay = {
  cashflowId?: string | null;
  tradeId?: string | null;
  settlementMethod?: string | null;
  paymentAmount?: string | null;
  cashflowStatus?: string | null;
  bookingEntity?: string | null;
  entityCode?: string | null;
  counterpartyCode?: string | null;
  currency?: string | null;
  payRec?: string | null;
  valueDate?: string | null;
  insufficientReason?: string;
  actionResult: {
    status: ResultStatus;
    message: string;
  };
};

export type CashflowEligibleResult = {
  eligibleForUpdate: {
    cashflows: CashflowDisplay[];
  };
  insufficientForUpdate: {
    cashflows: CashflowDisplay[];
  };
};

export type TradeCashflow = {
  tradeId?: string | null;
  cashflowIds?: string[];
};

export type SettlementMethodUpdateRequestBody = {
  trades: TradeCashflow[];
  settlementMethod: string;
  comment: string;
};

export type SettlementMethodUpdateResponse = {
  tradeId: string;
  cashflowIds: string[];
  success: boolean;
  errorMessage: string;
};
