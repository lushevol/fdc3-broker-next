export interface CashflowUserStatusUpdateRequest {
  lifecycleRequests: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    minorVersion: string;
    updater?: string;
    nstpReason?: string | null;
    comment: string;
    ratanAction: string;
    affirmationDetails?: {
      affirmedBy: string;
      phone_email: string;
      affirmedAt: string;
    };
  }[];
}

export enum ResponseCode {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  UNKNOWN = "UNKNOWN",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
}

export interface CashflowUserStatusUpdateResponse {
  success: boolean;
  errorMessage: string | null;
  responses: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    errorMessage: string | null;
    minorVersion: string;
    scbmlMessage: string;
    success: boolean;
  }[];
}

export type CashflowUserStatusUpdateApi = (
  p: CashflowUserStatusUpdateRequest
) => Promise<CashflowUserStatusUpdateResponse>;
