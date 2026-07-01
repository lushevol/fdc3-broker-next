enum CashflowState {
  PROJECTED = "PROJECTED",
  WAITING = "WAITING",
  READY = "READY",
}

export type NewSplitPreviewResponseItem = {
  cashflowId?: string;
  cashflowState: `${CashflowState}`;
  cashflowSubState: string;
  cashflowSubStateType: string;
  cfiCode: string;
  businessVersion: string;
  cashflowVersion: string;
  minorVersion: string;
  dataSourceSystem: string;
  eventType: string;
  paymentDate: string;
  paymentType: string;
  amount: number;
  currency: string;
  payRec: string;
  entryTime: string;
  bookingEntityFmid: string;
  bookingEntityFmCode: string;
  counterpartyFmid: string;
  counterpartyFmCode: string;
  allotment: string;
  netId: string;
  taxonomy: string;
  bicNetFlag?: string;
  beneficiaryBic?: string;
};

export interface CashflowNewSplittingParamsItem {
  cashflowId: string;
  businessVersion: string;
  cashflowVersion: string;
  minorVersion: string;
  counterpartyFmid: string;
  currency: string;
  entity: string;
  paymentDate: string;
  settlementMethod: string;
  payRec: string;
  amount: string;
  netId: string;
}

export interface CashflowNewSplittingPreviewMatrix {
  originalCashflow: CNCashflow;
  previewCashflowList: CNCashflow[];
  errorMsg: string | null;
  valid: boolean;
}

export interface CashflowNewSplittingPreviewResult {
  originalCashflow: NewSplitPreviewResponseItem;
  previewCashflowList: NewSplitPreviewResponseItem[];
  errorMsg: string | null;
  valid: boolean;
}

export interface ApiCashflowNewSplittingPreviewResponse {
  resultList: CashflowNewSplittingPreviewResult[];
}

export interface SplitPreviewComponentProps {
  previewMetrix: CashflowNewSplittingPreviewMatrix[];
  proceedPreviewing: boolean;
  splittingResult: {
    splitting: CNCashflow[];
    single: CNCashflow[];
    failed: CNCashflow[];
    valid: CNCashflow[];
  };
}

export interface ToBeSplitCashflowRequest {
  requestParams: CNCashflow;
}

export interface ManualSplitDataType {
  parentCashflow: {
    cashflowId: string;
    amount: string;
    currency: string;
  };
  childCashflows: {
    amount: string;
    currency: string;
  }[];
  affirmationDetails: {
    affirmedBy: string;
    phone_email: string;
    affirmedAt: any;
  };
}

export interface AmendSplitDataType {
  splittingId: string;
  requestList: {
    cashflowId: string;
    amount: string;
  }[];
}

export interface UnSplitDataType {
  cashflowId: string;
  minorVersion: string;
  businessVersion: string;
  splittingId: string;
}

export enum RoundingType {
  ROUNDING_OFF,
  ROUNDING_DOWN,
}

export enum SplitActionType {
  MANUAL_SPLIT = "MANUAL SPLIT",
  AMEND_SPLIT = "AMEND SPLIT",
  UN_SPLIT = "UN SPLIT",
  COMPONENT_SPLIT = "COMPONENT SPLIT",
  COMPLETE_SPLIT = "COMPLETE SPLIT",
}

export enum SplitCashflowState {
  WAITING = "WAITING",
  READY = "READY",
  RELEASED = "RELEASED",
  SETTLED = "SETTLED",
  QUEUED = "QUEUED",
  HOLD = "HOLD",
  FAILED = "FAILED",
  CASHFLOW_SUPPRESSED = "CASHFLOW_SUPPRESSED",
  SPLIT = "SPLIT",
  SWIFT_SUPPRESSED = "SWIFT_SUPPRESSED",
}

export enum InputStatusType {
  SUCCESS = "",
  WAITING = "warning",
  ERROR = "error",
}

export type SplittingTargetCashflowType =
  | SplitTargetCashflow[]
  | null
  | undefined;

export interface SplitValidationArrItem {
  cashflowId: string | null;
  rowId: string | number | null;
  inputStatus: InputStatusType;
  prefixMessage: string | null;
}

export type SplitRowIndexType = string | number | null;
