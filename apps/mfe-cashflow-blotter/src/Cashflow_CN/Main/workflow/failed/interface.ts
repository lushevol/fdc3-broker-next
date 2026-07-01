export type ActionType =
  | "Materialize"
  | "ReInstate"
  | "Failed"
  | "ConfirmFailed";

export type SubmitAction = "Fail" | "Approve" | "Reject";

export interface CashflowFailedRequest {
  action: SubmitAction;
  comment: string;
  cashflows: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    minorVersion: string;
  }[];
}

export interface CashflowFailedResponse {
  status?: number;
  errorCode?: string;
  errorMessage?: string;
  [key: string]: any;
}

export type CashflowFailedApi = (
  p: CashflowFailedRequest
) => Promise<CashflowFailedResponse>;

export interface CashflowUserStatusUpdateRequest {
  lifecycleRequests: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    minorVersion: string;
    updater: string;
    nstpReason?: string | null;
    comment: string;
    ratanAction: ActionType;
  }[];
}

interface CashflowUserStatusUpdateResponse {
  cashflowStatusResponseCode: string;
  cashflowStatusProcessingEntities: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    action: ActionType;
    updater: string;
    previousCashflowIndex: {
      minorVersion: string;
      cashflowStatus: {
        cashflowEnumMainStatus: string;
        cashflowEnumSubStatus: string;
        cashflowEnumSubStatusType: string;
      };
    };
    nextCashflowIndex: {
      minorVersion: string;
      cashflowStatus: {
        cashflowEnumMainStatus: string;
        cashflowEnumSubStatus: string;
        cashflowEnumSubStatusType: string;
      };
    };
    cashflowStatusResponseCode: string;
    reason: string | null;
    upgrade: boolean;
  }[];
}

export type CashflowUserStatusUpdateApi = (
  p: CashflowUserStatusUpdateRequest
) => Promise<CashflowUserStatusUpdateResponse>;
