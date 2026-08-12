import { NetType } from "src/Cashflow_CN/Main/workflow/netCashflow/netCashflowRightMenu";

export type NewNetPreviewResponseItem = {
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
  murexProductStrategy?: string;
};

enum CashflowState {
  PROJECTED = "PROJECTED",
  WAITING = "QUEUED",
  PENDING = "PENDING",
  VALIDATED = "VALIDATED",
}

export interface CashflowNewNettingParamsItem {
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
  murexProductStrategy?: string;
  paymentType?: string;
}

export interface AffirmationDetails {
  affirmedBy: string;
  phone_email: string;
  affirmedAt: string;
}

export interface CashflowNewNettingPreviewMatrix {
  originalCashflowList: CNCashflow[];
  previewCashflowList: CNCashflow[];
  errorMsg: string | null;
  valid: boolean;
}

export interface CashflowNewNettingPreviewResult {
  originalCashflowList: NewNetPreviewResponseItem[];
  previewCashflowList: NewNetPreviewResponseItem[];
  errorMsg: string | null;
  valid: boolean;
}

export interface ApiCashflowNewNettingPreviewResponse {
  resultList: CashflowNewNettingPreviewResult[];
}

export interface ToBeNettedCashflowRequest {
  requestParams: CNCashflow[];
}

export interface NetPreviewComponentProps {
  previewMetrix: CashflowNewNettingPreviewMatrix[];
  proceedPreviewing: boolean;
  netType: NetType;
  nettingResult: {
    netting: CNCashflow[];
    single: CNCashflow[];
    failed: CNCashflow[];
    valid: CNCashflow[];
  };
}

export interface ManualNettingRequestPayload {
  affirmationDetails: AffirmationDetails | null | undefined;
  requestList: CashflowNewNettingParamsItem[];
}

export type ManualNettingResponse = {
  status: number;
  message: string;
  data: ApiCashflowNewNettingPreviewResponse | null | undefined;
};
