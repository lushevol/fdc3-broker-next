export enum SettleUserType {
  Maker = "Maker",
  Checker = "Checker",
}

export type AllPossibleSettleUserType = `${SettleUserType}` | "Visitor";

export type SubmitAction = "ManualSettle" | "Approve" | "Reject";

export interface ManualSettleApiRequestBody {
  action: string;
  comment: string;
  cashflows: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    minorVersion: string;
  }[];
}

interface ManualSettleApiResponse {}

export type ManualSettleApi = (
  p: ManualSettleApiRequestBody
) => Promise<ManualSettleApiResponse>;
